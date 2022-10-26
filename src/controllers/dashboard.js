const sequelize = require("sequelize");
const status = require("http-status");
const _ = require("lodash");
const { logActivity } = require("../util/logger");
const { logger } = require("../util/enums");
const { Expense, Sale, Setting, Category } = require("../models");

const has = require("has-keys");

module.exports = {
	async summary(req, res) {
		try {
			//summed expenses
			const expenses = await Expense.sum("amount");
			const sales = await Sale.findAll({
				include: ["details"],
				order: [["createdAt", "DESC"]],
			});
			const dailySales = await Sale.findAll({
				attributes: [
					"saleDate",
					[sequelize.fn("sum", sequelize.col("sumAmt")), "total_amount"],
				],
				group: ["saleDate"],
				raw: true,
			});

			const dailyExpenses = await Expense.findAll({
				attributes: [
					"date",
					[sequelize.fn("sum", sequelize.col("amount")), "total_amount"],
				],
				group: ["date"],
				raw: true,
			});

			return res.json({
				status: true,
				data: {
					expenses,
					sales,
					dailySales,
					dailyExpenses,
				},
			});

			// summed sales
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},

	async getSettings(req, res) {
		try {
			const data = await Setting.findOne({});
			return res.json({
				status: true,
				data,
			});
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},

	async updateSettings(req, res) {
		try {
			let data = await Setting.findAll({});

			// clear existing settings
			if (data.length > 0) await Setting.destroy({ where: {} });

			let { receiptAbbreviation, purchaseCategory, addRestockExpense } =
				req.body;

			if (_.isEmpty(receiptAbbreviation)) receiptAbbreviation = "ABC";
			if (_.isEmpty(purchaseCategory)) {
				// set category to the first on the list
				const category = await Category.findOne({
					where: { type: "expense" },
				});
				purchaseCategory = category.name;
			}

			// create new record
			data = await Setting.create({
				// ...req.body,
				receiptAbbreviation,
				purchaseCategory,
				addRestockExpense,
			});

			// log
			await logActivity(
				`updated settings`,
				logger.logType.alert,
				logger.dept.application,
				req.user.id
			);

			return res.json({
				status: true,
				data,
			});
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
};
