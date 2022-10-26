const status = require("http-status");
const has = require("has-keys");
const sequelize = require("sequelize");
const { logActivity } = require("../util/logger");
const { logger } = require("../util/enums");

const { Category, SubCategory, Product } = require("../models");

module.exports = {
	async getCategoryById(req, res) {
		try {
			if (!has(req.params, "id"))
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			let { id } = req.params;

			let data = await Category.findOne({
				where: { id, isDeleted: false },
				include: [
					{
						model: SubCategory,
						as: "subCategories",
						attributes: ["id", "name", "categoryId"],
					},
				],
			});

			if (!data)
				throw { code: status.BAD_REQUEST, message: "Category not found" };

			return res.json({ status: true, message: "Returning category", data });
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
	async getCategories(req, res) {
		try {
			const { type, count_products } = req.query;

			let data = "";
			if (type && !count_products) {
				data = await Category.findAll({
					where: { type, isDeleted: false },
					include: {
						model: SubCategory,
						as: "subCategories",
						attributes: ["id", "name", "description", "categoryId"],
					},
				});
			}

			if (count_products && !type) {
				data = await Category.findAll({
					where: { type, isDeleted: false },
					include: {
						model: Product,
						as: "products",
						attributes: [
							"productName",
							"id",
							"purchasePrice",
							"sellingPrice",
							"quantity",
							// [sequelize.fn("count", sequelize.col("productName")), "count"],
						],
						// group: [Category.id],
						// raw: true,
					},
				});
			}

			if (count_products && type) {
				data = await Category.findAll({
					where: { type, isDeleted: false },
					include: [
						{
							model: SubCategory,
							as: "subCategories",
							attributes: ["id", "name", "description", "categoryId"],
						},
						{
							model: Product,
							as: "products",
							attributes: [
								"productName",
								"id",
								"purchasePrice",
								"sellingPrice",
								"quantity",
								// [sequelize.fn("count", sequelize.col("productName")), "count"],
							],
							// group: [Category.id],
							// raw: true,
						},
					],
				});
			}

			if (!type && !count_products) {
				data = await Category.findAll({
					where: { isDeleted: false },
					include: {
						model: SubCategory,
						as: "subCategories",
						attributes: ["id", "name", "description", "categoryId"],
					},
				});
			}

			return res.json({ status: true, message: "Returning categories", data });
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
	async getSubCategories(req, res) {
		try {
			if (!has(req.params, "id"))
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			let { id } = req.params;

			let data = await SubCategory.findOne({
				where: { categoryId: id },
				attributes: ["id", "name", "categoryId"],
			});

			return res.json({
				status: true,
				message: "Returning sub categories",
				data,
			});
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},

	async newCategory(req, res) {
		try {
			if (!has(req.body, ["name"]))
				throw {
					code: status.BAD_REQUEST,
					message: "Category must atleast have a name",
				};

			// logo not added
			let { name, description, type } = req.body;
			let data = await Category.create({
				name,
				description,
				type,
			});

			await logActivity(
				`new category (${data.name}) added`,
				logger.logType.info,
				logger.dept.inventory,
				req.user.id
			);

			return res.json({ status: true, message: "Category Added", data });
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
	async updateCategory(req, res) {
		try {
			if (!has(req.body, ["id", "name"]))
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify the id and name",
				};

			let { id, name, description, type } = req.body;

			let data = await Category.update(
				{
					name,
					description,
					type,
				},
				{ where: { id, isDeleted: false } }
			);

			await logActivity(
				`updated category (${req.body.name})`,
				logger.logType.info,
				logger.dept.inventory,
				req.user.id
			);

			return res.json({ status: true, message: "category updated", data });
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
	async deleteCategory(req, res) {
		try {
			if (!has(req.params, "id"))
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			let { id } = req.params;

			const data = await Category.update(
				{
					isDeleted: true,
				},
				{ where: { id } }
			);

			await logActivity(
				`deleted category (${data.name})`,
				logger.logType.info,
				logger.dept.inventory,
				req.user.id
			);

			return res.json({
				status: status.NO_CONTENT,
				message: "category deleted",
			});
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
};
