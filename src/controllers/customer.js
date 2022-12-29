const status = require("http-status");
const has = require("has-keys");

const { Customer } = require("../models");

module.exports = {
	async getCustomerById(req, res) {
		try {
			if (!has(req.params, "id"))
				return res.status(status.BAD_REQUEST).send({
					code: status.BAD_REQUEST,
					message: "You must specify the id.",
				});

			let { id } = req.params;

			let data = await Customer.findOne({ where: { id, isDeleted: false } });

			if (!data)
				return res.status(status.BAD_REQUEST).send({
					code: status.BAD_REQUEST,
					message: "customer not found.",
				});

			return res.json({
				status: true,
				message: "Returning customer info",
				data,
			});
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
	async getCustomers(req, res) {
		try {
			let data = await Customer.findAll({ where: { isDeleted: false } });
			return res.json({
				status: status.OK,
				message: "Returning customers",
				data,
			});
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
	async newCustomer(req, res) {
		try {
			if (!has(req.body, ["name", "primaryContact"]))
				return res.status(status.BAD_REQUEST).send({
					code: status.BAD_REQUEST,
					message: "Customer must atleast have a name and a number",
				});

			const cus = req.customer;
			let data = await Customer.create(cus);

			return res.json({
				status: status.OK,
				message: "Customer data added",
				data,
			});
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
	async updateCustomer(req, res) {
		try {
			if (!has(req.body, ["id", "name"]))
				return res.status(status.BAD_REQUEST).send({
					status: status.BAD_REQUEST,
					message: "You must specify the id and name",
				});

			const { id } = req.body;
			let data = await Customer.update(req.customer, { where: { id } });

			res.json({ status: true, message: "Customer info updated", data });
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
	async deleteCustomer(req, res) {
		try {
			if (!has(req.params, "id"))
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			let { id } = req.params;

			await Customer.update({ isDeleted: true }, { where: { id } });
			res.json({ status: status.NO_CONTENT, message: "Customer deleted" });
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
};
