// const config = require("config");
const { productSchema } = require( "../util/schemas" );
const { isDate, isFuture } = require( "date-fns" );
const status = require( "http-status" );
const _ = require( "lodash" );

function productValidator ( req, res, next ) {
	try {
		// console.log("inside product validator middleware ", req.body);
		const obj = _.pick( req.body, [
			"productName",
			"code",
			"purchasePrice",
			"sellingPrice",
			"quantity",
			"description",
			"location",
			"categoryId",
			"supplierId",
			"minQty",
			"maxQty",
			"expiryDate",
			"restockQty",
			"isAService",
		] );

		// expiry date clean-up
		if ( _.isEmpty( obj.expiryDate ) ) {
			obj.expiryDate = null;
		} else {
			// ensure that expiry date is valid
			if ( !isDate( new Date( obj.expiryDate ) ) )
				return res.status( 400 ).send( {
					status: status.BAD_REQUEST,
					message: "expiry date is not a valid date",
				} );

			// expiry date must be in the future
			if ( !isFuture( new Date( obj.expiryDate ) ) )
				return res.status( 400 ).send( {
					status: status.BAD_REQUEST,
					message: "expiry date must be in the future",
				} );

			// transform date into valid date
			obj.expiryDate = new Date( obj.expiryDate );
		}

		// validate data input
		const { value, error } = productSchema.validate( obj, {
			abortEarly: false,
			allowUnknown: true,
			stripUnknown: false,
		} );

		//abort if there is an error
		if ( error ) {
			return res.status( 400 ).send( {
				status: status.BAD_REQUEST,
				message: error.details,
			} );
		}
		req.product = value;
		next();
	} catch ( ex ) {
		// console.log(ex);
		res.status( 400 ).send( { message: "product validation failed" } );
	}
}

module.exports = productValidator;
