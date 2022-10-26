const status = require("http-status");
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { Op } = require("sequelize");
const generator = require("generate-password");
const { mailer } = require("../util/helpers");
const has = require("has-keys");
// const config = require( "config" );
const config = require("../../config/default.json");

const { logActivity } = require("../util/logger");
const { logger } = require("../util/enums");

module.exports = {
	async login(req, res) {
		try {
			// TODO: Determine source n check if user has permission to

			// finding duplicate users
			let user = await User.findOne({
				where: {
					username: req.body.username,
					isDeleted: false,
				},
			});
			if (!user)
				return res
					.status(status.BAD_REQUEST)
					.send("invalid username or password");

			// check role permission
			// if (user.role !== req.body.role)
			// 	return res
			// 		.status(status.UNAUTHORIZED)
			// 		.send({ msg: "you are not authorized" });

			// compare password
			const validPassword = await bcrypt.compare(
				req.body.password,
				user.password
			);

			if (!validPassword)
				return res
					.status(status.BAD_REQUEST)
					.send("invalid username or password");

			//generate n sign a jwt
			const token = jwt.sign(
				{ id: user.id, email: user.email, role: user.role },
				config.jwtPrivateKey
			);

			// log
			await logActivity(
				`login`,
				logger.logType.security,
				logger.dept.application,
				user.id
			);
			return res.header("authorization", token).json({
				msg: "success",
				token,
				data: {
					email: user.email,
					role: user.role,
					id: user.id,
					username: user.username,
				},
			});
		} catch (ex) {
			console.log(ex);
			return res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},

	async signUp(req, res) {
		try {
			// finding duplicate users
			let user = await User.findOne({
				where: {
					[Op.or]: [
						{ username: req.body.username },
						{ email: req.body.email },
						{ staffId: req.body.staffId },
					],
				},
			});

			// email matches
			if (user) return res.status(409).send({ message: "User already exist" });

			// hashing password
			const salt = await bcrypt.genSalt(10);
			const password = await bcrypt.hash(req.body.password, salt);

			user = await User.create({
				password,
				email: req.body.email,
				username: req.body.username,
				role: req.body.role,
				staffId: req.body.staffId,
			});

			// log
			await logActivity(
				`signup (${user.username})`,
				logger.logType.security,
				logger.dept.application,
				user.id
			);

			// save n return data
			return res.status(status.OK).send({
				data: _.pick(user, ["id", "email", "username", "role"]),
				message: "success",
			});
		} catch (ex) {
			console.log(ex);
			return res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async forgotPassword(req, res) {
		try {
			// check if email exist
			let user = await User.findOne({
				where: { email: req.body.email, isDeleted: false },
			});
			if (!user) return res.status(409).send({ msg: "account does not exist" });

			// generate a new password
			const randomPwd = generator.generate({
				length: 10,
				numbers: true,
				excludeSimilarCharacters: true,
			});

			// hash password
			const salt = await bcrypt.genSalt(10);
			const newPassword = await bcrypt.hash(randomPwd, salt);

			// update user record
			user.password = newPassword;
			user.save();

			// send email
			// sendEmail(
			// 	user.email,
			// 	mailer.subjects.passwordReset,
			// 	mailer.messages.passwordReset(randomPwd)
			// );

			// 	(
			// 	user.email,
			// 	"Password Reset",
			// 	"Your automatically generated password is '" +
			// 		randomPwd +
			// 		"'. Use it to change your password."
			// );

			// log
			await logActivity(
				`password reset`,
				logger.logType.security,
				logger.dept.application,
				user.id
			);

			return res.status(200).send({
				msg: "success",
				newPassword: randomPwd,
				data: _.pick(user, ["email", "username", "role"]),
			});
		} catch (err) {
			console.log("error ", err);
			return res.status(500).send("An internal server error occurred");
		}
	},

	async changePassword(req, res) {
		try {
			const currentPwd = req.body.currentPassword;
			const newPwd = req.body.newPassword;

			// check if old and new passwords are the same
			if (currentPwd === newPwd)
				return res.status(304).send("passwords are the same");

			// check if email exist
			let user = await User.findOne({
				where: { id: req.body.userId, isDeleted: false },
			});
			if (!user)
				return res
					.status(status.BAD_REQUEST)
					.send({ msg: "account does not exist" });

			// compare passwords
			const validPassword = await bcrypt.compare(currentPwd, user.password);
			if (!validPassword)
				return res.status(status.BAD_REQUEST).send("invalid password");

			// hash password
			const salt = await bcrypt.genSalt(10);
			const hashedPwd = await bcrypt.hash(newPwd, salt);

			// update user record
			user.password = hashedPwd;
			await user.save();

			// send email
			// sendEmail(
			// 	user.email,
			// 	mailer.subjects.passwordChange,
			// 	mailer.messages.passwordChanged()
			// );

			// log
			await logActivity(
				`password changed`,
				logger.logType.security,
				logger.dept.application,
				user.id
			);
			return res.status(200).send({
				msg: "success",
				// data: _.pick(user, ["email", "role", "username"]),
			});
		} catch (err) {
			console.log("error ", err);
			return res.status(500).send("An internal server error occurred");
		}
	},
	async getUserById(req, res) {
		try {
			if (!has(req.params, "id"))
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			let { id } = req.params;

			let data = await User.findOne({ where: { id, isDeleted: false } });

			if (!data) throw { code: status.BAD_REQUEST, message: "User not found" };

			res.json({ status: true, message: "Returning user", data });
		} catch (err) {
			console.log("error ", err);
			return res.status(500).send("internal server error");
		}
	},
	async getUsers(req, res) {
		try {
			let data = await User.findAll({
				// where: { isDeleted: false },
				attributes: ["id", "username", "staffId", "role", "email", "isDeleted"],
				include: ["staff"],
			});

			res.json({ status: true, message: "Returning users", data });
		} catch (err) {
			console.log("error ", err);
			return res.status(500).send("internal server error");
		}
	},
	// async newUser(req, res) {
	// 	if (!has(req.body, ["username", "role"]))
	// 		throw {
	// 			code: status.BAD_REQUEST,
	// 			message: "You must specify the username and role",
	// 		};

	// 	let { staffId, username, password, role, email } = req.body;

	// 	const data = await User.create({
	// 		staffId,
	// 		username,
	// 		password,
	// 		role,
	// 		email,
	// 	});

	// 	res.json({ status: true, message: "User Added", data });
	// },
	async updateUser(req, res) {
		try {
			if (!has(req.body, ["id", "username"]))
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify the username",
				};

			let { id, staffId, username, role, email } = req.body;

			const data = await User.update(
				{ staffId, username, role, email },
				{ where: { id, isDeleted: false } }
			);

			// log
			await logActivity(
				`user profile update (${req.body.username})`,
				logger.logType.security,
				logger.dept.application,
				req.user.id
			);
			res.json({ status: true, data, message: "User updated" });
		} catch (err) {
			console.log("error ", err);
			return res.status(500).send("internal server error");
		}
	},

	async toggleDelete(req, res) {
		try {
			if (!has(req.params, "id"))
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify the id",
				};

			let { id } = req.params;
			const user = await User.findOne({ where: { id } });
			user.isDeleted = !user.isDeleted;
			user.save();

			// log
			await logActivity(
				`updated user (${user.username}) account status`,
				logger.logType.security,
				logger.dept.application,
				req.user.id
			);

			res.json({ status: true, message: "User deleted" });
		} catch (err) {
			console.log("error ", err);
			return res.status(500).send("internal server error");
		}
	},
};
