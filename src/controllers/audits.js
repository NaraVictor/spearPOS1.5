const sequelize = require("sequelize");
const status = require("http-status");
const _ = require("lodash");

const {
	Sale,
	User,
	Product,
	SaleDetail,
	Category,
	Expense,
	PurchaseOrder,
	PurchaseOrderDetail,
	Staff,
	Supplier,
} = require("../models");

const has = require("has-keys");

module.exports = {
	async getSalesAudits(req, res) {
		try {
			const sales = await Sale.findAll({
				include: [
					{
						model: User,
						as: "user",
						attributes: ["username"],
						include: {
							model: Staff,
							as: "staff",
							attributes: ["firstName", "lastName"],
						},
					},
					{
						model: SaleDetail,
						as: "details",
						attributes: ["quantity", "unitPrice"],
						include: [
							{
								model: Product,
								as: "product",
								attributes: ["productName"],
								include: [
									{
										model: Category,
										as: "category",
										attributes: ["name"],
									},
								],
							},
						],
					},
				],
				order: [["createdAt", "DESC"]],
			});

			return res.status(200).send({
				data: sales,
				message: "returning sales audit data",
			});
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async getProductsAudits(req, res) {
		try {
			const data = await Product.findAll({
				// attributes: [
				// 	"id",
				// 	"productName",
				// 	"purchasePrice",
				// 	"sellingPrice",
				// 	"quantity",
				// 	"createdAt",
				// 	"salesCount",
				// ],
				include: [
					{
						model: User,
						as: "user",
						attributes: ["username"],
					},
					{
						model: SaleDetail,
						as: "sales",
						attributes: [
							"quantity",
							// [(sequelize.fn("sum", sequelize.col("quantity")), "qtySold")],
						],
					},
					{
						model: PurchaseOrderDetail,
						as: "purchases",
						attributes: ["restockQty"],
					},
					{
						model: Category,
						as: "category",
						attributes: ["name"],
					},
					{
						model: Supplier,
						as: "supplier",
						attributes: ["id", "supplierName"],
					},
				],
			});
			return res.status(200).send({
				data,
				message: "returning product audit data",
			});
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async getExpensesAudits(req, res) {
		try {
			const data = await Expense.findAll({
				include: [
					{
						model: Category,
						as: "category",
						attributes: ["name"],
					},
					{
						model: User,
						as: "user",
						attributes: ["username"],
						include: {
							model: Staff,
							as: "staff",
							attributes: ["firstName", "lastName"],
						},
					},
				],
			});
			return res.status(200).send({
				data,
				message: "returning expenses audit data",
			});
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async getPurchasesAudits(req, res) {
		try {
			const data = await PurchaseOrder.findAll({
				attributes: ["sumAmt", "sumQty", "productCount", "createdAt"],
				include: [
					{
						model: User,
						as: "user",
						attributes: ["username"],
						include: {
							model: Staff,
							attributes: ["firstName", "lastName"],
							as: "staff",
						},
					},
					{
						model: PurchaseOrderDetail,
						as: "details",
						attributes: ["availableQty", "restockQty", "unitPrice"],
						include: {
							model: Product,
							as: "product",
							attributes: ["productName"],
						},
					},
				],
			});

			return res.status(200).send({
				data,
				message: "returning purchases audit data",
			});
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async getCharts(req, res) {
		try {
			const chart = req.query["chart"];
			if (_.isEmpty(chart))
				return res.status(status.BAD_REQUEST).send({
					message: "query paramter (chart) is missing",
				});

			let data = "";
			if (chart === "sales") {
				data = await Category.findAll({
					where: { type: "product" },
					attributes: ["name"],
					// attributes: [
					// 	"saleDate",
					// 	[sequelize.fn("sum", sequelize.col("amountPaid")), "total_amount"],
					// ],
					include: [
						{
							model: Product,
							as: "products",
							attributes: ["productName"],
							include: {
								model: SaleDetail,
								as: "sales",
								attributes: ["productId", "quantity", "unitPrice"],
							},
						},
					],
					// group: ["name"],
					// raw: true,
				});
			}

			if (chart === "incomeexpenses") {
				// ToDo:
			}

			return res.status(200).send({
				data,
				message: "returning chart data",
			});
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
};
