const status = require( "http-status" );
const _ = require( "lodash" );
const { logActivity } = require( "../util/logger" );
const { logger } = require( "../util/enums" );

const { Product, Category, Supplier } = require( "../models" );

const has = require( "has-keys" );
const { Op } = require( "sequelize" );

module.exports = {
	async getProductById ( req, res, next ) {
		try {
			if ( !has( req.params, "id" ) )
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			let { id } = req.params;

			if ( !parseInt( id ) ) next();

			let data = await Product.findOne( {
				where: {
					id,
					isDeleted: false,
					[ Op.or ]: {
						quantity: { [ Op.gt ]: 0 },
						isAService: true,
					},
				},
			} );

			if ( !data )
				throw { code: status.BAD_REQUEST, message: "Product not found" };

			return res.json( { status: true, message: "Returning product", data } );
		} catch ( ex ) {
			console.log( ex );
			res
				.status( status.INTERNAL_SERVER_ERROR )
				.send( { message: "internal server error" } );
		}
	},
	async getProducts ( req, res ) {
		try {
			let data = await Product.findAll( {
				where: { isDeleted: false },
				include: [
					{
						model: Category,
						as: "category",
						attributes: [ "id", "name", "type" ],
					},
					{
						model: Supplier,
						as: "supplier",
						allowNull: true,
						attributes: [ "id", "supplierName" ],
					},
				],
				order: [ [ "productName", "ASC" ] ],
			} );
			return res.json( { status: true, message: "Returning products", data } );
		} catch ( ex ) {
			console.log( ex );
			res
				.status( status.INTERNAL_SERVER_ERROR )
				.send( { message: "internal server error" } );
		}
	},
	async getProductByCategory ( req, res, next ) {
		try {
			if ( !has( req.params, "categoryId" ) )
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify the categoryId",
				};

			let { categoryId } = req.params;

			if ( !parseInt( categoryId ) ) next();

			let data = await Product.findAll( {
				where: { categoryId, isDeleted: false },
				include: { model: Category, as: "category", attributes: [ "name" ] },
			} );

			if ( !data )
				throw { code: status.BAD_REQUEST, message: "Products not found" };

			return res.json( {
				status: true,
				message: "Returning products by category",
				data,
			} );
		} catch ( ex ) {
			console.log( ex );
			res
				.status( status.INTERNAL_SERVER_ERROR )
				.send( { message: "internal server error" } );
		}
	},
	async newProduct ( req, res ) {
		try {
			if ( !has( req.product, [ "productName", "purchasePrice" ] ) )
				return res.status( 400 ).send( {
					code: status.BAD_REQUEST,
					message: "Product name and purchase price must be specified",
				} );

			const conflict = await Product.findOne( {
				where: { productName: req.product.productName },
			} );

			if ( conflict )
				return res.status( 409 ).send( {
					code: status.CONFLICT,
					message: "A product with the same name exists.",
				} );

			if ( req.product.isAService ) {
				req.product.quantity = 1;
				req.product.minQty = 0;
				req.product.maxQty = 0;
				req.product.restockQty = 0;
			}

			if ( req.product.supplierId === "" ) {
				delete req.product.supplierId;
			}

			req.product.userId = req.user.id;
			let data = await Product.create( req.product );

			await logActivity(
				`new product added (${ data.productName })`,
				logger.logType.info,
				logger.dept.inventory,
				req.user.id
			);

			return res.json( {
				status: true,
				message: "Product Added",
				data: _.pick( data, [
					"id",
					"productName",
					"purchasePrice",
					"sellingPrice",
					"quantity",
					"isAService",
				] ),
			} );
		} catch ( ex ) {
			console.log( ex );
			res
				.status( status.INTERNAL_SERVER_ERROR )
				.send( { message: "internal server error " } );
		}
	},
	async updateProduct ( req, res ) {
		try {
			if ( !has( req.body, [ "id", "productName" ] ) )
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify the id and name of the product",
				};

			let data = await Product.update(
				{ ...req.product },
				{
					where: { id: req.body.id },
				}
			);

			await logActivity(
				`updated product item (${ req.product.productName })`,
				logger.logType.info,
				logger.dept.inventory,
				req.user.id
			);
			return res.json( {
				status: true,
				message: "product updated",
				data: _.pick( data, [
					"id",
					"productName",
					"code",
					"purchasePrice",
					"sellingPrice",
					"quantity",
					"isAService",
					"description",
					"location",
					"categoryId",
					"supplierId",
					"minQty",
					"maxQty",
					"expiryDate",
					"restockQty",
				] ),
			} );
		} catch ( ex ) {
			console.log( ex );
			res.status( status.INTERNAL_SERVER_ERROR ).send( { message: "error" } );
		}
	},
	async deleteProduct ( req, res ) {
		try {
			if ( !has( req.params, "id" ) )
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			let { id } = req.params;

			const prod = await Product.findOne( { where: { id } } );

			const name = prod.productName;

			// update product name to prevent naming conflicts
			prod.productName =
				prod.productName + ` - [DELETED ON ${ new Date().toUTCString() }]`;
			prod.isDeleted = true;
			await prod.save();

			await logActivity(
				`deleted product (${ name })`,
				logger.logType.alert,
				logger.dept.inventory,
				req.user.id
			);

			return res.json( { status: true, message: "Product deleted" } );
		} catch ( ex ) {
			console.log( ex );
			res
				.status( status.INTERNAL_SERVER_ERROR )
				.send( { message: "internal server error" } );
		}
	},
};
