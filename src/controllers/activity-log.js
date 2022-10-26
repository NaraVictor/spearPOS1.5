const sequelize = require("sequelize");
const status = require("http-status");
const { logActivity } = require("../util/logger");
const { logger } = require("../util/enums");

const { User, ActivityLog, Staff } = require("../models");

const has = require("has-keys");

module.exports = {
	async getLogs(req, res) {
		try {
			const data = await ActivityLog.findAll({
				include: [
					{
						model: User,
						as: "user",
						attributes: ["username", "email", "role"],
						include: {
							model: Staff,
							as: "staff",
							attributes: ["firstName", "lastName"],
						},
					},
				],
				order: [["createdAt", "DESC"]],
			});
			return res.status(200).send({
				data,
				message: "returning all activity logs",
			});
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async getUserLogs(req, res) {
		try {
			const data = await ActivityLog.findAll({
				where: { userId: req.params.userId },
				include: [
					{
						model: User,
						as: "user",
						attributes: ["username", "email", "role"],
						include: {
							model: Staff,
							as: "staff",
							attributes: ["firstName", "lastName"],
						},
					},
				],
				order: [["createdAt", "DESC"]],
			});
			return res.status(200).send({
				data,
				message: "returning all user activity logs",
			});
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async deleteLogs(req, res) {
		try {
			// find a better if there is? delete without finding...
			await ActivityLog.destroy({ where: {} });
			// await log.destroy();

			// log
			await logActivity(
				`deleted all activity logs`,
				logger.logType.security,
				logger.dept.application,
				req.user.id
			);

			// return
			return res.status(200).send({
				status: status.NO_CONTENT,
				message: "all logs deleted",
			});
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async deleteLog(req, res) {
		try {
			const log = await ActivityLog.findOne({
				where: { id: req.params.id },
			});
			await log.destroy();

			// log
			await logActivity(
				`deleted an activity log`,
				logger.logType.security,
				logger.dept.application,
				req.user.id
			);

			return res.status(200).send({
				status: status.NO_CONTENT,
				message: "activity log deleted",
			});
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
};
