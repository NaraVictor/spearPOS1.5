const status = require("http-status");
const has = require("has-keys");
const { logActivity } = require("../util/logger");
const { logger } = require("../util/enums");
const { SubCategory } = require("../models");

module.exports = {
	async getSubCategoryById(req, res) {
		try {
			if (!has(req.params, "id"))
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			let { id } = req.params;

			let data = await SubCategory.findOne({ where: { id } });

			if (!data)
				throw { code: status.BAD_REQUEST, message: "SubCategory not found" };

			res.json({ status: true, message: "Returning SubCategory", data });
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async getSubCategories(req, res) {
		try {
			const categoryId = req.query["categoryId"];
			let data = "";
			if (categoryId) {
				data = await SubCategory.findAll({
					where: { categoryId },
				});
			} else {
				data = await SubCategory.findAll({});
			}
			return res.json({
				status: true,
				message: "Returning sub categories",
				data,
			});
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async newSubCategory(req, res) {
		try {
			if (!has(req.body, ["name"]))
				throw {
					code: status.BAD_REQUEST,
					message: "SubCategory must atleast have a name",
				};

			// logo not added
			let { name, description, categoryId } = req.body;
			let data = await SubCategory.create({
				name,
				description,
				categoryId,
			});

			// log
			await logActivity(
				`added a new subcategory (${data.name})`,
				logger.logType.info,
				logger.dept.inventory,
				req.user.id
			);

			res.json({ status: true, message: "SubCategory Added", data });
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async updateSubCategory(req, res) {
		try {
			if (!has(req.body, ["id", "name"]))
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify the id and name",
				};

			let { id, name, description, categoryId } = req.body;

			let data = await SubCategory.update(
				{
					name,
					description,
					categoryId,
				},
				{ where: { id } }
			);

			// log
			await logActivity(
				`updated subcategory (${req.body.name})`,
				logger.logType.info,
				logger.dept.inventory,
				req.user.id
			);
			res.json({ status: true, message: "SubCategory updated", data });
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async deleteSubCategory(req, res) {
		try {
			if (!has(req.params, "id"))
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			let { id } = req.params;

			await SubCategory.destroy({ where: { id } });
			res.json({ status: status.NO_CONTENT, message: "category deleted" });
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
};
