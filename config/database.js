const CryptoJS = require( "crypto-js" );
const { key } = require( '../src/util/enums' )

module.exports = {
  development: {
    username: "postgres",
    password: "admin",
    database: "spearPOS_dev",
    host: "localhost",
    dialect: "postgres"
  },
  production: {
    username: CryptoJS.AES.encrypt( process.env.DB_USER, key ).toString( CryptoJS.enc.Utf8 ),
    password: CryptoJS.AES.encrypt( process.env.DB_PASSWORD, key ).toString( CryptoJS.enc.Utf8 ),
    database: CryptoJS.AES.encrypt( process.env.DB_NAME, key ).toString( CryptoJS.enc.Utf8 ),
    host: "localhost",
    dialect: "postgres"
  }
}
