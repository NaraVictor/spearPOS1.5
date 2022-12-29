const status = require("http-status");

const { Brand } = require("../models");

const has = require("has-keys");

module.exports = {
	async getBrandById(req, res) {
		try {
			if (!has(req.params, "id"))
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			let { id } = req.params;

			let data = await Brand.findOne({ where: { id } });

			if (!data) throw { code: status.BAD_REQUEST, message: "Brand not found" };

			res.json({ status: true, message: "Returning brand", data });
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async getBrands(req, res) {
		try {
			let data = await Brand.findAll({});
			res.json({ status: true, message: "Returning brands", data });
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async newBrand(req, res) {
		try {
			if (!has(req.body, ["brand"]))
				throw {
					code: status.BAD_REQUEST,
					message: "Brand must atleast have a name",
				};

			// logo not added
			let { brand, contact, email } = req.body;
			let data = await Brand.create({
				brand,
				contact,
				email,
			});

			res.json({ status: true, message: "Brand Added", data });
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async updateBrand(req, res) {
		try {
			if (!has(req.body, ["id", "brand"]))
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify the id and name of the product",
				};

			let { id, brand, contact, email } = req.body;

			let data = await Brand.update(
				{
					brand,
					contact,
					email,
				},
				{ where: { id } }
			);

			res.json({ status: true, message: "brand updated", data });
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async deleteBrand(req, res) {
		try {
			if (!has(req.params, "id"))
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			let { id } = req.params;

			await Brand.destroy({ where: { id } });
			res.json({ status: true, message: "brand deleted" });
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},

	async topSelling(req, res) {
		try {
			// sum sales
			// return products with highest sales sum in descending order
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
};
