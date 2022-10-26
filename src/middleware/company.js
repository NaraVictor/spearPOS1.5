const _ = require("lodash");
const status = require("http-status");
const { companySchema } = require("../util/schemas");
const has = require("has-keys");

function companyValidator(req, res, next) {
	try {
		if (!has(req.body, ["companyName", "primaryContact"]))
			return res.status(status.BAD_REQUEST).send({
				status: status.BAD_REQUEST,
				message: "company must atleast have a name and contact",
			});

		const { value, error } = companySchema.validate(req.body, {
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

		req.company = value;
		next();
	} catch (ex) {
		res.status(400).send({ message: "company validation error" });
	}
}

module.exports = companyValidator;
