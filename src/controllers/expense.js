const status = require("http-status");
const has = require("has-keys");
const { logActivity } = require("../util/logger");
const { logger } = require("../util/enums");

const { Expense, Category } = require("../models");

module.exports = {
	async getExpenseById(req, res) {
		try {
			if (!has(req.params, "id"))
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			let { id } = req.params;

			let data = await Expense.findOne({ where: { id } });

			if (!data) throw { code: status.BAD_REQUEST, message: "Item not found" };

			return res.json({
				status: true,
				message: "Returning expense info",
				data,
			});
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
	async getExpenses(req, res) {
		try {
			let data = await Expense.findAll({
				include: [
					{
						model: Category,
						as: "category",
						attributes: ["name"],
					},
				],
				order: [["updatedAt", "DESC"]],
			});
			return res.json({
				status: status.OK,
				message: "Returning expenses",
				data,
			});
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
	async newExpense(req, res) {
		try {
			let data = await Expense.create({
				...req.expense,
				userId: req.user.id,
			});

			// log
			await logActivity(
				`new expense (${data.description.substring(0, 5)}...)`,
				logger.logType.info,
				logger.dept.misc,
				req.user.id
			);
			return res.json({ status: status.OK, message: "Expense Added", data });
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
	async updateExpense(req, res) {
		try {
			if (!has(req.body, ["id", "description"]))
				return res.status(status.BAD_REQUEST).send({
					status: status.BAD_REQUEST,
					message: "You must specify the id and description",
				});

			let { id, description, amount, categoryId, date } = req.body;

			let data = await Expense.update(
				{
					description,
					amount,
					categoryId,
					date,
				},
				{ where: { id } }
			);

			// log
			await logActivity(
				`updated expenditure item (${req.body.description.substring(0, 5)}...)`,
				logger.logType.info,
				logger.dept.misc,
				req.user.id
			);
			return res.json({ status: true, message: "Expense info updated", data });
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
	async deleteExpense(req, res) {
		try {
			if (!has(req.params, "id"))
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			let { id } = req.params;

			await Expense.destroy({ where: { id } });

			// log
			await logActivity(
				`deleted expenditure item`,
				logger.logType.info,
				logger.dept.misc,
				req.user.id
			);
			return res.json({
				status: status.NO_CONTENT,
				message: "Expense deleted",
			});
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
};
