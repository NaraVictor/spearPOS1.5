const status = require("http-status");
const has = require("has-keys");
const _ = require("lodash");

const { Supplier, Product } = require("../models");

module.exports = {
	async getSupplierById(req, res) {
		try {
			if (!has(req.params, "id"))
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			let { id } = req.params;
			let data = await Supplier.findOne({ where: { id } });

			if (!data)
				throw { status: status.BAD_REQUEST, message: "Supplier not found" };

			res.json({ status: true, message: "Returning suppliers' info", data });
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
	async getSuppliers(req, res) {
		try {
			let data = await Supplier.findAll({});
			res.json({ status: status.OK, message: "Returning suppliers", data });
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
	async getSupplierProducts(req, res) {
		try {
			if (!has(req.params, "id"))
				throw {
					status: status.BAD_REQUEST,
					message: "You must specify supplier id",
				};

			let { id } = req.params;
			let data = await Product.findAll({
				where: { supplierId: id },
				attributes: [
					"id",
					"productName",
					"purchasePrice",
					"sellingPrice",
					"quantity",
					"isAService",
				],
			});

			res.json({
				status: status.OK,
				message: "Returning supplier products",
				data,
			});
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
	async newSupplier(req, res) {
		try {
			let data = await Supplier.create(req.supplier);
			res.json({
				status: status.OK,
				message: "Supplier Added",
				data: _.pick(data, [
					"id",
					"supplierName",
					"contact",
					"email",
					"location",
				]),
			});
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
	async updateSupplier(req, res) {
		try {
			if (!has(req.body, ["id"]))
				throw {
					status: status.BAD_REQUEST,
					message: "You must specify the id and name",
				};

			let data = await Supplier.update(req.supplier, {
				where: { id: req.body.id },
			});

			res.json({
				status: status.OK,
				message: "Supplier info updated",
				data: _.pick(data, [
					"id",
					"supplierName",
					"contact",
					"email",
					"location",
				]),
			});
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
	async deleteSupplier(req, res) {
		try {
			if (!has(req.params, "id"))
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			let { id } = req.params;

			await Supplier.destroy({ where: { id } });
			res.json({ status: status.NO_CONTENT, message: "Supplier deleted" });
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
};
