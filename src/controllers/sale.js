const status = require( "http-status" );
const { receiptNumberGenerator } = require( "../util/helpers" );
const { logActivity } = require( "../util/logger" );
const { logger } = require( "../util/enums" );
const {
	Sale,
	SaleDetail,
	Product,
	User,
	Staff,
	Setting,
	PaymentHistory,
	RegisterSequence,
	RegisterPayment,
	Customer,
	Company,
	sequelize,
	// Debtor,
} = require( "../models" );
const { Op, literal, Sequelize, col } = require( "sequelize" );
// const sequelize = require("sequelize");

const has = require( "has-keys" );

module.exports = {
	async getSaleById ( req, res ) {
		if ( !has( req.params, "id" ) )
			throw { code: status.BAD_REQUEST, message: "You must specify the id" };

		let { id } = req.params;

		let data = await Sale.findOne( {
			where: { id },
			include: [
				{
					model: SaleDetail,
					as: "details",
					attributes: [ "productId", "quantity", "unitPrice" ],
					include: [
						{
							model: Product,
							as: "product",
							attributes: [ "productName", "quantity" ],
						},
					],
				},
				{
					model: User,
					as: "user",
					attributes: [ "username", "role" ],
					include: {
						model: Staff,
						as: "staff",
						attributes: [ "firstName", "lastName" ],
					},
				},
			],
		} );

		if ( !data ) throw { code: status.BAD_REQUEST, message: "Sale not found" };

		return res.json( {
			status: true,
			message: "Returning sale information",
			data,
		} );
	},
	async getSales ( req, res ) {
		try {
			let data = await Sale.findAll( {
				include: [
					{
						model: SaleDetail,
						as: "details",
						attributes: [ "productId", "quantity", "unitPrice" ],
						include: [
							{
								model: Product,
								as: "product",
								attributes: [ "productName", "quantity" ],
							},
						],
					},
					{
						model: User,
						as: "user",
						attributes: [ "username", "role" ],
					},
				],
				order: [ [ "createdAt", "DESC" ] ],
			} );

			return res.json( { status: true, message: "Returning sales", data } );
		} catch ( ex ) {
			console.log( ex );
			res
				.status( status.INTERNAL_SERVER_ERROR )
				.send( { message: "internal server error" } );
		}
	},
	async getDebtors ( req, res ) {
		try {
			let data = await Sale.findAll( {
				where: {
					amountPaid: {
						[ Op.lt ]: col( "sumAmt" ),
					},
				},
				include: [
					{
						model: Customer,
						as: "customer",
						allowNull: true,
						attributes: [ "id", "name", "primaryContact", "gender" ],
					},
					{
						model: User,
						as: "user",
						attributes: [ "id", "username" ],
						include: {
							model: Staff,
							as: "staff",
							attributes: [ "firstName", "lastName" ],
						},
					},
				],
				order: [ [ "createdAt", "DESC" ] ],
			} );

			return res.json( {
				status: true,
				message: "Returning sales debtors",
				data,
			} );
		} catch ( ex ) {
			console.log( ex );
			res
				.status( status.INTERNAL_SERVER_ERROR )
				.send( { message: "internal server error" } );
		}
	},

	async newSale ( req, res ) {
		try {
			// validate sale sum and amount paid presence
			if ( !has( req.body, [ "sumAmt", "amountPaid" ] ) )
				return res.status( status.BAD_REQUEST ).send( {
					status: status.BAD_REQUEST,
					message: "Sale sum or amount paid not found",
				} );

			let {
				amountPaid,
				sumAmt,
				customerId,
				picked,
				registerId,
				paymentMethod,
				discount,
				remark,
			} = req.body;

			sumAmt = parseFloat( sumAmt || 0.0 );
			amountPaid = parseFloat( amountPaid || 0.0 );
			discount = parseFloat( discount || 0 );

			// validate line items & payment method
			if ( picked?.length === 0 )
				return res.status( status.BAD_REQUEST ).send( {
					message: "no sale items found",
				} );

			if ( !paymentMethod )
				return res.status( status.BAD_REQUEST ).send( {
					message: "no payment method found",
				} );

			// validate debtorship
			const isDebtor = sumAmt - discount > amountPaid;
			if ( isDebtor && !customerId )
				return res.status( status.BAD_REQUEST ).send( {
					message:
						"a customer is required for this transaction (amount paid is less than balance)",
				} );

			// CASH SALE TO REGISTER
			const register = await RegisterSequence.findOne( {
				where: { isClosed: false, id: registerId },
			} );

			// transaction starts here
			await sequelize.transaction( async ( t ) => {
				if ( register ) {
					// console.log("register found ", register);

					const registerPayment = await RegisterPayment.findOne( {
						where: { registerSequenceId: register.id },
					} );

					const cash = sumAmt;

					if ( registerPayment ) {
						// add to payments
						registerPayment.expected =
							parseFloat( registerPayment.expected ) + cash;
						await registerPayment.save();
					} else {
						// create new
						await RegisterPayment.create(
							{
								paymentType: "CASH SALE",
								expected: cash,
								registerSequenceId: registerId,
							},
							{ transaction: t }
						);
					}
				} else {
					return res.status( status.BAD_REQUEST ).send( {
						message: "cash register not opened. try opening register again",
					} );
				}

				// VALIDATE RECEIPT ABBREVIATION
				const settings = await Setting.findOne( {} );

				if ( !settings )
					return res.status( status.BAD_REQUEST ).send( {
						message: "receipt abbreviation not found",
					} );

				// VALIDATE COMPANY DETAILS
				const company = await Company.findOne( {} );

				if ( !company )
					return res.status( status.BAD_REQUEST ).send( {
						message: "business details not found",
					} );

				// initiate sale
				let sale = await Sale.create(
					{
						sumAmt,
						amountPaid,
						userId: req.user.id,
						discount,
						paymentMethod,
						remark,
					},
					{ transaction: t }
				);

				// generating receipt number
				let receipt = receiptNumberGenerator(
					sale.id,
					settings.receiptAbbreviation || "ABC"
				);
				sale.receiptNumber = receipt;

				if ( customerId ) sale.customerId = customerId;

				await sale.save( { transaction: t } );

				// insert sale detail
				const details = picked?.map( ( item ) => {
					return {
						saleId: sale.id,
						productId: item.id,
						quantity: parseInt( item.count ),
						unitPrice: parseFloat( item.sellingPrice ),
					};
				} );

				await SaleDetail.bulkCreate( details, { transaction: t } );

				// update product quantities
				details.map( async ( d ) => {
					const prod = await Product.findOne( {
						where: { id: d.productId },
					} );

					// reduce quantity and increment sale counter

					if ( !( prod.quantity - d.quantity < 0 ) ) {
						// services can't have qty updates
						if ( !prod.isAService ) prod.quantity = prod.quantity - d.quantity;

						//
						if ( prod.salesCount === 0 ) {
							prod.salesCount = 1;
						} else {
							prod.salesCount = prod.salesCount + 1;
						}
						await prod.save( { transaction: t } );
					}
				} );

				// record payment
				await PaymentHistory.create(
					{
						amount: sale.amountPaid,
						saleId: sale.id,
						userId: req.user.id,
					},
					{ transaction: t }
				);

				// key in as a debtor if so
				// if (isDebtor) {
				// 	// add customer and sale information to debtors
				// 	await Debtor.create({
				// 		saleId: sale.id,
				// 		customerId,
				// 		userId: req.user.id,
				// 		sumAmount: sumAmt,
				// 		amountPaid,
				// 	});
				// }

				// log
				await logActivity(
					`committed a sale transaction`,
					logger.logType.info,
					logger.dept.sales,
					req.user.id,
					t
				);

				return res.status( status.OK ).json( {
					status: true,
					data: sale,
					message: "Sale Added",
				} );
			} );
		} catch ( ex ) {
			console.log( ex );
			res
				.status( status.INTERNAL_SERVER_ERROR )
				.send( { message: "internal server error" } );
		}
	},

	async reverseSale ( req, res ) {
		try {
			if ( !has( req.params, [ "id" ] ) )
				res.status( status.BAD_REQUEST ).send( {
					status: status.BAD_REQUEST,
					message: "required sale 'id' not found",
				} );

			const { id } = req.params;

			// check if there is an opened register
			const openedRegister = await RegisterSequence.findOne( {
				where: { isClosed: false },
				order: [ [ "createdAt", "DESC" ] ],
			} );

			// if there is no open register,
			if ( !openedRegister ) {
				return res.status( status.BAD_REQUEST ).send( {
					status: status.BAD_REQUEST,
					message: "An opened register is required for sale reversal",
				} );
			}

			// transaction starts here
			await sequelize.transaction( async ( t ) => {
				// find sale record
				const sale = await Sale.findOne( {
					where: { id },
				} );

				// quit if there is no matching sale
				if ( !sale ) {
					return res.status( status.NOT_FOUND ).send( {
						status: status.NOT_FOUND,
						message: "There is no sale with matching record",
					} );
				}

				// sale details, if exists, reverse all products quantities
				const saleDetail = await SaleDetail.findAll( {
					where: { saleId: id },
				} );

				if ( saleDetail ) {
					saleDetail.map( async ( d ) => {
						const prod = await Product.findOne( { where: { id: d.productId } } );
						prod.quantity = parseInt( prod.quantity ) + parseInt( d.quantity );
						prod.salesCount = parseInt( prod.salesCount ) - 1;
						await prod.save( { transaction: t } );
					} );

					// delete sale detail
					await SaleDetail.destroy( {
						where: { saleId: id },
						transaction: t,
					} );
				}

				// deduct amount paid from register payment
				const registerpym = await RegisterPayment.findOne( {
					where: { registerSequenceId: openedRegister.id },
				} );

				// if there is a sale
				if ( registerpym ) {
					registerpym.expected =
						parseFloat( registerpym.expected ) - parseFloat( sale.sumAmt );
					await registerpym.save( { transaction: t } );
				}

				// delete all debtors if any
				// await Debtor.destroy({ where: { saleId: id } });

				// then delete sale payment history n sale
				await PaymentHistory.destroy( { where: { saleId: id }, transaction: t } );
				await Sale.destroy( { where: { id }, transaction: t } );

				// log activity
				await logActivity(
					`reversed a sale transaction`,
					logger.logType.info,
					logger.dept.sales,
					req.user.id,
					t
				);

				return res.status( status.OK ).json( {
					status: status.OK,
					message: "Sale reversed successfully. Products quantities returned",
				} );
			} );
		} catch ( ex ) {
			console.log( ex );
			res
				.status( status.INTERNAL_SERVER_ERROR )
				.send( { message: "internal server error" } );
		}
	},

	async updateSale ( req, res ) {
		if ( !has( req.body, [ "id", "name", "email" ] ) )
			throw {
				code: status.BAD_REQUEST,
				message: "You must specify the id, name and email",
			};

		let { id, name, email } = req.body;

		await Sale.update( { name, email }, { where: { id } } );

		return res.json( { status: true, message: "Sale updated" } );
	},

	async getPayments ( req, res ) {
		if ( !has( req.params, "id" ) )
			return res.status( status.BAD_REQUEST ).send( {
				status: status.BAD_REQUEST,
				message: "You must specify the sales id",
			} );

		const data = await PaymentHistory.findAll( {
			where: { saleId: req.params.id },
			include: {
				model: User,
				as: "user",
				attributes: [ "username" ],
				include: {
					model: Staff,
					as: "staff",
					attributes: [ "firstName", "lastName" ],
				},
			},
		} );

		return res.json( {
			status: true,
			data,
			message: "returning payments history",
		} );
	},
	async makePayment ( req, res ) {
		try {
			if ( !has( req.params, "id" ) )
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify the sales id",
				};

			// transaction starts here
			await sequelize.transaction( async ( t ) => {
				let { saleId, amount } = req.body;
				const data = await PaymentHistory.create(
					{
						amount,
						saleId,
						userId: req.user.id,
					},
					{ transaction: t }
				);

				const sale = await Sale.findOne( {
					where: { id: saleId },
				} );

				// updating payment value
				sale.amountPaid =
					parseFloat( sale.amountPaid || 0.0 ) + parseFloat( amount );
				await sale.save( { transaction: t } );

				// debtor here

				// log
				await logActivity(
					`added a payment record`,
					logger.logType.info,
					logger.dept.sales,
					req.user.id
				);

				return res.json( { status: true, data, message: "payment recorded" } );
			} );
		} catch ( ex ) {
			console.log( ex );
			res
				.status( status.INTERNAL_SERVER_ERROR )
				.send( { message: "internal server error" } );
		}
	},
	async deletePayment ( req, res ) {
		if ( !has( req.params, "id" ) )
			throw { code: status.BAD_REQUEST, message: "You must specify the id" };

		let { id } = req.params;

		await Sale.destroy( { where: { id } } );

		// log
		await logActivity(
			`deleted payment history`,
			logger.logType.info,
			logger.dept.sales,
			req.user.id
		);
		return res.json( { status: true, message: "Sale deleted" } );
	},
	async deleteSale ( req, res ) {
		if ( !has( req.params, "id" ) )
			throw { code: status.BAD_REQUEST, message: "You must specify the id" };

		let { id } = req.params;

		// await Sale.destroy({ where: { id } });

		// log
		await logActivity(
			`deleted a sale transaction`,
			logger.logType.info,
			logger.dept.sales,
			req.user.id
		);
		return res.json( { status: true, message: "Sale deleted" } );
	},
};
