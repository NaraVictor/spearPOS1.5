const status = require("http-status");
const has = require("has-keys");
const { logActivity } = require("../util/logger");
const { logger } = require("../util/enums");
const _ = require("lodash");
const {
	PurchaseOrder,
	PurchaseOrderDetail,
	Product,
	User,
	Expense,
	Setting,
	Category,
	sequelize,
} = require("../models");

module.exports = {
	async getPurchaseOrderById(req, res) {
		try {
			if (!has(req.params, "id"))
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			let { id } = req.params;

			let data = await PurchaseOrder.findOne({ where: { id } });

			if (!data)
				throw { code: status.BAD_REQUEST, message: "purchase order not found" };

			return res.json({
				status: status.OK,
				message: "Returning purchase order",
				data,
			});
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
	async getPurchaseOrders(req, res) {
		try {
			let data = await PurchaseOrder.findAll({
				order: ["createdAt"],
				include: [
					{
						model: PurchaseOrderDetail,
						as: "details",
						attributes: [
							"productId",
							"availableQty",
							"restockQty",
							"unitPrice",
						],
						include: [
							{
								model: Product,
								as: "product",
								attributes: ["productName"],
							},
						],
					},
					{
						model: User,
						attributes: ["username"],
						as: "user",
					},
				],
			});
			return res.json({
				status: status.OK,
				message: "Returning purchase orders",
				data,
			});
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
	async newPurchaseOrder(req, res) {
		try {
			if (!has(req.body, ["productCount"]))
				throw {
					code: status.BAD_REQUEST,
					message: "Purchase Order should have atleast a product count",
				};

			const { sumAmt, sumQty, productCount, comment } = req.body;

			await sequelize.transaction(async (t) => {
				const purchaseOrder = await PurchaseOrder.create(
					{
						sumAmt: parseFloat(sumAmt),
						sumQty,
						productCount,
						userId: req.user.id,
						comment,
					},
					{ transaction: t }
				);

				// inserting into the purchase order detail table
				req.body.selected.map(async (prod) => {
					await PurchaseOrderDetail.create(
						{
							purchaseOrderId: purchaseOrder.id,
							productId: prod.id,
							availableQty: parseInt(prod.quantity || 0),
							restockQty: parseInt(prod.restockQty || 1),
							unitPrice: parseFloat(prod.purchasePrice || 0),
						},
						{ transaction: t }
					);
				});

				// update products quantities
				req.body.selected.map(async (prod) => {
					const p = await Product.findOne({
						where: { id: prod.id },
					});
					p.quantity =
						parseInt(p.quantity || 0) + parseInt(prod.restockQty || 0);
					await p.save();
				});

				// enter purchase as an expense
				const settings = await Setting.findOne({});

				// determine if restocks should be automatically entered as expenses
				if (settings?.addRestockExpense) {
					const cat = await Category.findOne({
						where: { name: settings.purchaseCategory },
					});

					await Expense.create(
						{
							description: "purchase of goods (restocking)",
							amount: purchaseOrder.sumAmt,
							categoryId: cat.id,
							userId: req.user.id,
						},
						{ transaction: t }
					);
				}

				// log
				await logActivity(
					`committed a purchase (restock) transaction`,
					logger.logType.info,
					logger.dept.inventory,
					req.user.id,
					t
				);

				return res.status(status.OK).json({
					status: status.OK,
					message: "Purchase Order Added",
					data: purchaseOrder,
				});
			}); //transaction ends
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
	async updatePurchaseOrder(req, res) {
		try {
			if (!has(req.body, ["id"]))
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify the id and name",
				};

			// needs updating

			return res.json({
				status: status.OK,
				message: "Purchase Order info updated",
			});
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
	async deletePurchaseOrder(req, res) {
		try {
			if (!has(req.params, "id"))
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			let { id } = req.params;

			await PurchaseOrder.destroy({ where: { id } });

			// log
			await logActivity(
				`deleted a purchase (restock) transaction`,
				logger.logType.info,
				logger.dept.inventory,
				req.user.id
			);

			return res.json({
				status: status.NO_CONTENT,
				message: "Purchase deleted",
			});
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},

	// approve, fulfilled
};
