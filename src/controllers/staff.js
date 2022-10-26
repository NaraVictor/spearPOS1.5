const status = require("http-status");
const has = require("has-keys");
const { logActivity } = require("../util/logger");
const { logger } = require("../util/enums");
const { Staff, User } = require("../models");

module.exports = {
	async getStaffById(req, res) {
		try {
			if (!has(req.params, "id"))
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			let { id } = req.params;

			let data = await Staff.findOne({ where: { id, isDeleted: false } });

			if (!data) throw { code: status.BAD_REQUEST, message: "Staff not found" };

			return res.json({
				status: true,
				message: "Returning Staffs' info",
				data,
			});
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async getStaffs(req, res) {
		try {
			let data = await Staff.findAll({ where: { isDeleted: false } });
			return res.json({ status: status.OK, message: "Returning staffs", data });
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async newStaff(req, res) {
		try {
			if (!has(req.body, ["firstName", "lastName"]))
				throw {
					code: status.BAD_REQUEST,
					message: "staff must have first and last names",
				};

			let {
				firstName,
				lastName,
				birthdate,
				gender,
				contact,
				email,
				position,
				staffType,
				departmentId,
			} = req.body;
			let data = await Staff.create({
				firstName,
				lastName,
				birthdate,
				gender,
				contact,
				email,
				position,
				staffType,
				departmentId,
			});

			// log
			// await logActivity(
			// 	`added a new staff (${data.firstName} ${data.lastName})`,
			// 	logger.logType.info,
			// 	logger.dept.misc,
			// 	req.user.id
			// );

			return res.json({ status: status.OK, message: "Staff Added", data });
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async updateStaff(req, res) {
		try {
			if (!has(req.body, ["id", "firstName"]))
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify the id and firstName",
				};

			let {
				id,
				firstName,
				lastName,
				birthdate,
				gender,
				contact,
				email,
				position,
				staffType,
			} = req.body;

			let data = await Staff.update(
				{
					firstName,
					lastName,
					birthdate,
					gender,
					contact,
					email,
					position,
					staffType,
				},
				{ where: { id } }
			);

			return res.json({
				status: status.OK,
				message: "Staff info updated",
				data,
			});
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async deleteStaff(req, res) {
		try {
			if (!has(req.params, "id"))
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			let { id } = req.params;
			const staff = await Staff.update({ isDeleted: true }, { where: { id } });

			if (staff)
				await User.update({ isDeleted: true }, { where: { staffId: id } });

			return res.json({
				status: status.NO_CONTENT,
				message: "Staff with corresponding user account details deleted",
			});
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
};
