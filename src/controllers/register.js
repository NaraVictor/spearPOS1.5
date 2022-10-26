const status = require("http-status");

const {
	RegisterSequence,
	RegisterPayment,
	Register,
	User,
} = require("../models");
const { logActivity } = require("../util/logger");
const { logger } = require("../util/enums");

const has = require("has-keys");

module.exports = {
	async getRegisterById(req, res) {
		try {
			if (!has(req.params, "id"))
				return res.status(status.BAD_REQUEST).send({
					status: status.BAD_REQUEST,
					message: "You must specify the id",
				});

			let { id } = req.params;

			let data = await RegisterSequence.findOne({
				where: { id },
				include: [
					{
						model: User,
						as: "user",
						attributes: ["username", "id"],
					},
					{
						model: RegisterPayment,
						as: "payments",
					},
				],
			});

			if (!data)
				return res.status(status.BAD_REQUEST).send({
					status: status.BAD_REQUEST,
					message: "Register sequence not found",
				});

			return res.json({
				status: true,
				message: "Returning register information",
				data,
			});
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
	async getRegisters(req, res) {
		try {
			let data = await RegisterSequence.findAll({
				order: [["createdAt", "DESC"]],
				include: [
					{
						model: RegisterPayment,
						as: "payments",
					},
					{
						model: User,
						as: "user",
						attributes: ["username", "id"],
					},
				],
			});

			return res.json({
				status: true,
				message: "Returning Register sequences",
				data,
			});
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
	async getPreviousRegister(req, res) {
		try {
			if (!has(req.body, ["openTime", "closeTime"]))
				return res.status(status.BAD_REQUEST).send({
					status: status.BAD_REQUEST,
					message: "open and close times not found",
				});
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
	async openRegister(req, res) {
		try {
			// validated from schema
			const cleanedRegister = req.registerSequence;

			// find any opened 'previous' register
			const openedRegister = await RegisterSequence.findOne({
				where: { isClosed: false },
				order: [["createdAt", "DESC"]],
				// limit: 1
			});

			// if previous is not closed,
			if (openedRegister) {
				return res.status(status.BAD_REQUEST).send({
					status: status.BAD_REQUEST,
					message: "previous register not closed",
				});
			}

			// SCENARIOS -> BOTH APPLY
			// there is a previous register and its closed, proceed to creating a new register
			// there are no register entries; create a new register (first register)
			const recentReg = await RegisterSequence.findOne({
				where: { isClosed: true },
				order: [["createdAt", "DESC"]],
			});

			// update this code in version two
			// to pick based on the outlet
			const register = await Register.findOne({});
			let sequence = 1;

			if (recentReg) {
				let sq = parseInt(recentReg.sequence);
				sequence = ++sq;
			}

			cleanedRegister.sequence = sequence;
			cleanedRegister.userId = req.user.id;
			cleanedRegister.openTime = Date.now();
			cleanedRegister.registerId = register.id;

			const data = await RegisterSequence.create(cleanedRegister);

			// make a new entry into register payments with opening float
			// rethink about it

			await logActivity(
				`register opened`,
				logger.logType.alert,
				logger.dept.sales,
				req.user.id
			);

			return res.status(status.OK).json({
				status: status.OK,
				data,
				message: "register opened successfully",
			});
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
	async closeRegister(req, res) {
		try {
			if (!has(req.body, ["closeTime", "id"]))
				return res.status(status.BAD_REQUEST).send({
					status: status.BAD_REQUEST,
					message: "invalid close and open time. try reseting register",
				});

			const reg = req.register;

			const register = await RegisterSequence.findOne({
				where: { id: req.body.id, isClosed: false },
			});

			if (!register) {
				return res.status(status.BAD_REQUEST).send({
					status: status.BAD_REQUEST,
					message: "no opened register found",
				});
			}

			register.closeTime = Date.now();
			// register.openingNote = req.body.openingNote
			register.closingNote = req.body.closingNote;
			register.isClosed = true;

			await register.save();

			// register payments re-concilation
			let pymts = await RegisterPayment.findOne({
				where: { registerSequenceId: register.id },
			});

			if (!pymts) {
				pymts = await RegisterPayment.create({
					paymentType: "CASH SALES",
					counted: parseFloat(req.body.counted) || 0,
					difference: parseFloat(req.body.difference) || 0,
					registerSequenceId: register.id,
				});
			} else {
				pymts.paymentType = "CASH SALES";
				pymts.counted = parseFloat(req.body.counted) || 0;
				pymts.difference = parseFloat(req.body.difference) || 0;

				await pymts.save();
			}

			await logActivity(
				`register closed`,
				logger.logType.alert,
				logger.dept.sales,
				req.user.id
			);

			return res.status(status.OK).json({
				status: status.OK,
				data: register,
				message: "register closed successfully",
			});
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
	async updateRegister(req, res) {
		if (!has(req.body, ["id", "name", "email"]))
			throw {
				code: status.BAD_REQUEST,
				message: "You must specify the id, name and email",
			};

		let { id, name, email } = req.body;

		await Order.update({ name, email }, { where: { id } });

		res.json({ status: true, message: "Order updated" });
	},
	async deleteRegister(req, res) {
		try {
			if (!has(req.params, "id"))
				return res.status(status.BAD_REQUEST).send({
					status: status.BAD_REQUEST,
					message: "You must specify the id",
				});

			let { id } = req.params;

			await RegisterPayment.destroy({ where: { registerSequenceId: id } });
			await RegisterSequence.destroy({ where: { id } });

			return res.json({
				status: status.NO_CONTENT,
				message: "Register deleted",
			});
		} catch (ex) {
			console.log(ex);
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.send({ message: "internal server error" });
		}
	},
};
