// // Patches
const { inject, errorHandler } = require( "express-custom-error" );
inject(); // Patch express in order to use async / await syntax
require( 'dotenv' ).config()

// Require Dependencies
const express = require( "express" );
const cors = require( "cors" );
const helmet = require( "helmet" );
const fileUpload = require( "express-fileupload" );

const app = express();

// Configure Express App Instance
app.use( helmet() );
app.use( express.json( { limit: "50mb" } ) );
app.use( express.urlencoded( { extended: true, limit: "10mb" } ) );
app.use( cors() );
app.use(
	fileUpload( {
		createParentPath: true,
		preserveExtension: true,
	} )
);

// use dev dependencies when developing
if ( process.env.NODE_ENV === "development" ) {
	const morgan = require( "morgan" );
	const logger = require( "./src/util/logger" );

	app.use( logger.dev, logger.combined );
	app.use( morgan( "dev" ) );
}


// This middleware adds the json header to every response
app.use( "*", ( req, res, next ) => {
	res.setHeader( "Content-Type", "application/json" );
	next();
} );

// Assign Routes
app.use( "/", require( "./src/routes/router" ) );

// // Handle errors
app.use( errorHandler() );

// Handle not valid route
app.use( "*", ( req, res ) => {
	res.status( 404 ).json( { status: false, message: "Endpoint Not Found" } );
} );


app.listen( process.env.PORT || 1531, () => {
	console.log( "Server is up and running no PORT: ", process.env.PORT );
	console.log( "Environment is: ", process.env.NODE_ENV );
} );
