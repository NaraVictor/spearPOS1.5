require( 'dotenv' ).config()

const createStaff = require( "./src/seeders/01-create-staff" );
const createUser = require( "./src/seeders/02-create-user" );
const createCat = require( "./src/seeders/03-create-category" );
const createRegister = require( "./src/seeders/04-create-register" );
const { sequelize } = require( "./src/models" );


sequelize.sync( { alter: true } ).then( ( s ) => {
    const queryInterface = s.getQueryInterface();
    createStaff.up( queryInterface, sequelize );
    createUser.up( queryInterface, sequelize );
    createCat.up( queryInterface, sequelize );
    createRegister.up( queryInterface, sequelize );
} );