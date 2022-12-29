const status = require("http-status");
const { customerSchema } = require("../util/schemas");
const has = require("has-keys");

function customerValidator(req, res, next) {
	try {
		if (!has(req.body, ["name", "primaryContact"]))
			throw {
				status: status.BAD_REQUEST,
				message: "customer must atleast have a name and contact",
			};

		const { value, error } = customerSchema.validate(req.body, {
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

		req.customer = value;
		next();
	} catch (ex) {
		console.log(ex);
		res.status(400).send({ message: "customer validation error" });
	}
}

module.exports = customerValidator;
