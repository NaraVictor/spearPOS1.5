const joi = require( "joi" );

const productSchema = joi.object( {
	productName: joi.string().required().min( 2 ).label( "product name" ),
	code: joi.string().allow( "" ).min( 8 ).label( "barcode" ),
	purchasePrice: joi
		.number()
		.precision( 2 )
		.greater( 0 )
		.required()
		.label( "purchase price" ),
	sellingPrice: joi
		.number()
		.precision( 2 )
		.required()
		//ruleset start defining the restrictions...
		// rule defines action when restrictions are broken
		.ruleset.greater( joi.ref( "purchasePrice" ) )
		.rule( { message: '"selling" price must be greater than purchase price' } )
		.label( "selling price" ),
	quantity: joi.number().precision( 2 ).min( 1 ).default( 1 ).required(),
	minQty: joi.number().label( "minimum quantity" ).default( 0 ),
	maxQty: joi.number().label( "maximum quantity" ).default( 0 ),
	restockQty: joi.number().default( 0 ).label( "restock quantity" ),
	expiryDate: joi
		.date()
		.allow( null )
		.ruleset.max( new Date( 2050, 1, 1 ) )
		.rule( { message: "expiry date not allowed beyond 2050" } )
		.label( "expiry date" ),
	isAService: joi.boolean().required().label( "is a service?" ),
	description: joi.string().allow( "" ).label( "description" ),
	location: joi.string().allow( "" ).label( "location" ),
	categoryId: joi
		.number()
		.required()
		.label( "category" )
		.messages( { "any.only": '"category" is required' } ),
	// supplierId: joi.number().allow(null).label("supplier"),
	// userId: joi.number().required().label("user"),
} );

const companySchema = joi.object( {
	companyName: joi.string().required().min( 5 ).label( "company name" ),
	primaryContact: joi
		.string()
		.min( 10 )
		.max( 15 )
		.required()
		.label( "primary contact" ),
	secondaryContact: joi
		.string()
		.min( 10 )
		.max( 15 )
		.allow( "" )
		.label( "secondary contact" ),
	email: joi.string().email().allow( "" ),
	address: joi.string().allow( "" ),
	VAT: joi.string().allow( "" ),
	TIN: joi.string().required(),
	gps: joi.string().allow( "" ),
} );

const expenseSchema = joi.object( {
	description: joi.string().min( 3 ).required(),
	amount: joi.number().required().greater( 0 ),
	date: joi.date().required(),
	categoryId: joi.number().required().label( "category" ),
} );

const supplierSchema = joi.object( {
	supplierName: joi.string().required().min( 3 ).label( "supplier name" ),
	contact: joi.string().min( 10 ).max( 15 ).required(),
	email: joi.string().email().allow( "" ),
	location: joi.string().required(),
} );

const staffSchema = joi.object( {
	firstName: joi.string().required().min( 3 ).label( "first name" ),
	lastName: joi.string().required().min( 3 ).label( "last name" ),
	birthdate: joi.date().required(),
	gender: joi.string().required().valid( "Male", "Female" ),
	contact: joi.string().min( 10 ).max( 15 ).required(),
	email: joi.string().email().allow( "" ),
	position: joi.string().allow( "" ),
	staffType: joi.string().allow( "" ).label( "staff type" ),
} );

const categorySchema = joi.object( {
	name: joi.string().required().min( 3 ).allow( "" ),
	desccription: joi.string().min( 3 ).allow( "" ),
	type: joi.string().required().allow( "" ).valid( "product", "expense" ),
} );

const outletSchema = joi.object( {
	outletName: joi.string().required().min( 3 ).label( "outlet name" ),
	address: joi.string().required(),
	gps: joi.string(),
	region: joi.string().required(),
	city: joi.string().required(),
	country: joi.string().required(),
	phone: joi.string().min( 10 ).max( 15 ).required(),
} );

const customerSchema = joi.object( {
	name: joi.string().required().min( 3 ).label( "customer name" ),
	primaryContact: joi
		.string()
		.min( 10 )
		.max( 15 )
		.required()
		.label( "primary contact" ),
	secondaryContact: joi
		.string()
		.min( 10 )
		.max( 15 )
		.allow( "" )
		.label( "secondary contact" ),
	email: joi.string().email().allow( "" ),
	address: joi.string().allow( "" ),
	gender: joi.string().allow( "" ).min( 3 ),
	category: joi.string().allow( "" ).min( 3 ),
	isDeleted: joi.boolean().default( false ),
} );

const purchaseOrderSchema = joi.object( {
	sumAmt: joi.number().required().min( 0.01 ),
	sumQty: joi.number().required().min( 1 ),
	productCount: joi.number().required().min( 1 ),
	comment: joi.string().allow( "" ),
} );

const registerSequenceSchema = joi.object( {
	// sequence: joi.number().allow(null),
	openTime: joi.date().allow( null ).label( "open time" ),
	// closeTime: joi.date().allow(null).label("close time"),
	openingFloat: joi.number().precision( 2 ).required().label( "opening float" ),
	openingNote: joi.string().allow( "" ),
	// isClosed: joi.boolean(),
	// registerId: joi.number(),
	// userId: joi.number(),
} );

const registerPaymentSchema = joi.object( {
	// paymentType: joi.string().required().min(2),
	expected: joi.number().required().min( 0 ).precision( 2 ).label( "expected cash" ),
	counted: joi.number().required().min( 0 ).precision( 2 ).label( "counted cash" ),
	difference: joi.number().required().precision( 2 ),
	registerId: joi.number().label( "register" ),
} );

module.exports = {
	customerSchema,
	outletSchema,
	categorySchema,
	staffSchema,
	supplierSchema,
	expenseSchema,
	companySchema,
	productSchema,
	registerSequenceSchema,
	registerPaymentSchema,
	purchaseOrderSchema,
};
