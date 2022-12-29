const status = require("http-status");
const has = require("has-keys");
const _ = require("lodash");
const { logActivity } = require("../util/logger");
const { logger } = require("../util/enums");

const { Company } = require("../models");

module.exports = {
	async getCompanyById(req, res) {
		try {
			if (!has(req.params, "id"))
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			let { id } = req.params;

			let data = await Company.findOne({ where: { id } });

			if (!data)
				throw { code: status.BAD_REQUEST, message: "Company not found" };

			return res.json({
				status: true,
				message: "Returning company info",
				data,
			});
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async getCompanies(req, res) {
		try {
			let data = await Company.findAll({});
			return res.json({
				status: status.OK,
				message: "Returning company info",
				data,
			});
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async newCompany(req, res) {
		try {
			const company = await Company.findAll({});
			if (!_.isEmpty(company)) {
				return res.status(status.BAD_REQUEST).send({
					code: status.BAD_REQUEST,
					message: "There cannot be double entries for company information",
				});
			}

			// logo not added
			let data = await Company.create(req.company);

			// log
			await logActivity(
				`created company profile`,
				logger.logType.alert,
				logger.dept.application,
				req.user.id
			);

			return res.json({ status: status.OK, message: "Company Added", data });
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
	async updateCompany(req, res) {
		try {
			const { id } = req.body;
			let data = await Company.update(req.company, { where: { id } });

			// log
			await logActivity(
				`updated company records`,
				logger.logType.alert,
				logger.dept.application,
				req.user.id
			);

			return res.json({ status: status.OK, message: "Company updated", data });
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
	// async deleteCompany(req, res) {
	// 	try {
	// 		if (!has(req.params, "id"))
	// 			throw { code: status.BAD_REQUEST, message: "You must specify the id" };

	// 		let { id } = req.params;

	// 		await Company.destroy({ where: { id } });
	// 		return res.json({
	// 			status: status.NO_CONTENT,
	// 			message: "company deleted",
	// 		});
	// 	} catch (ex) {
	// 		// console.log(ex);
	// 		res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
	// 	}
	// },
};
