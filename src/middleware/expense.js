const _ = require("lodash");
const status = require("http-status");
const { expenseSchema } = require("../util/schemas");
const has = require("has-keys");

function expenseMiddleWare(req, res, next) {
	try {
		if (!has(req.body, ["description", "amount"]))
			return res.status(status.BAD_REQUEST).send({
				status: status.BAD_REQUEST,
				message: "expenditure description and amount missing",
			});

		const { value, error } = expenseSchema.validate(req.body, {
			abortEarly: false,
			stripUnknown: true,
			allowUnknown: false,
		});

		//abort if there is an error
		if (error) {
			return res.status(status.BAD_REQUEST).send({
				status: status.BAD_REQUEST,
				message: error.details,
			});
		}

		req.expense = value;
		next();
	} catch (ex) {
		res.status(400).send({ message: "expense validation error" });
	}
}

module.exports = expenseMiddleWare;
