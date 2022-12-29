const _ = require("lodash");
const status = require("http-status");
const { supplierSchema } = require("../util/schemas");
const has = require("has-keys");

function supplierValidator(req, res, next) {
	try {
		if (!has(req.body, ["supplierName", "contact"]))
			throw {
				status: status.BAD_REQUEST,
				message: "Supplier must atleast have a name and contact",
			};

		// const obj = _.pick(req.body, [
		// 	"supplierName",
		// 	"location",
		// 	"contact",
		// 	"email",
		// ]);

		const { value, error } = supplierSchema.validate(req.body, {
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

		req.supplier = value;
		next();
	} catch (ex) {
		res.status(400).send({ message: "supplier validation error" });
	}
}

module.exports = supplierValidator;
