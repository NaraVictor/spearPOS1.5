// const config = require("config");
const config = require("../../config/default.json");
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
	// console.log("request headers -> ", req.heder);
	const token = req.header("authorization");
	if (!token) return res.status(401).send("Access denied. No token provided");

	try {
		const decoded = jwt.verify(
			token,
			config.jwtPrivateKey
			// config.get( "jwtPrivateKey" )
		);
		req.user = decoded;
		next();
	} catch (ex) {
		res.status(400).send({ message: "Invalid token" });
	}
}

module.exports = authenticateToken;
