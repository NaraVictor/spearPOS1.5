const _ = require("lodash");
const status = require("http-status");
const {
	registerSequenceSchema,
	registerPaymentSchema,
} = require("../util/schemas");
const has = require("has-keys");

function registerSequenceValidator(req, res, next) {
	try {
		if (!has(req.body, ["openTime", "openingFloat"]))
			throw {
				status: status.BAD_REQUEST,
				message: "opening time and float not found",
			};

		//
		const obj = _.pick(req.body, ["openTime", "openingFloat", "openingNote"]);

		const { value, error } = registerSequenceSchema.validate(obj, {
			abortEarly: false,
			stripUnknown: true,
			allowUnknown: false,
		});

		//abort if there is an error
		if (error) {
			return res.status(status.BAD_REQUEST).send({
				status: status.BAD_REQUEST,
				message: error.details,
			});
		}

		req.registerSequence = value;
		next();
	} catch (ex) {
		console.log(ex);
		res.status(400).send({ message: "register sequence validation error" });
	}
}

function registerPaymentValidator(req, res, next) {
	try {
		if (!has(req.body, ["counted"]))
			return res.status(status.BAD_REQUEST).send({
				status: status.BAD_REQUEST,
				message: "invalid register payment",
			});

		const { value, error } = registerPaymentSchema.validate(req.body, {
			abortEarly: false,
			stripUnknown: false,
			allowUnknown: true,
		});

		//abort if there is an error
		if (error) {
			return res.status(status.BAD_REQUEST).send({
				status: status.BAD_REQUEST,
				message: error.details,
			});
		}

		req.register = value;
		next();
	} catch (ex) {
		res.status(400).send({ message: "register payment validation error" });
	}
}

module.exports = { registerSequenceValidator, registerPaymentValidator };
