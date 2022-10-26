// // Patches
const { inject, errorHandler } = require( "express-custom-error" );
inject(); // Patch express in order to use async / await syntax

// Require Dependencies
const express = require( "express" );
const cors = require( "cors" );
const helmet = require( "helmet" );
const { sequelize } = require( "./src/models" );
const fileUpload = require( "express-fileupload" );
// const createStaff = require("./src/seeders/01-create-staff");
// const createUser = require("./src/seeders/02-create-user");
// const createCat = require("./src/seeders/03-create-category");
// const createRegister = require("./src/seeders/04-create-register");
// const db = require("./config/database.json");
// const fs = require("fs");

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
	// // Configure custom logger middleware
	const morgan = require( "morgan" );
	const logger = require( "./src/util/logger" );

	app.use( logger.dev, logger.combined );
	app.use( morgan( "dev" ) );
}

// check if db doesn't exist
// if so, synchronize it n insert seed data
// const env = process.env.NODE_ENV || "development";
// const dbExists = fs.existsSync(db[env].storage);

// if (!dbExists) {
// 	sequelize.sync({}).then((s) => {
// 		const queryInterface = s.getQueryInterface();
// 		createStaff.up(queryInterface, sequelize);
// 		createUser.up(queryInterface, sequelize);
// 		createCat.up(queryInterface, sequelize);
// 		createRegister.up(queryInterface, sequelize);
// 	});
// }

// sequelize.sync({ alter: true });

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

console.log( "system stage is ", process.env.NODE_ENV );
// Open Server on selected Port
const PORT = 1531;
app.listen( PORT, () => {
	console.log( "app is up and running" );
} );
