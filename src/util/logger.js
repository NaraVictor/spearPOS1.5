const morgan = require("morgan");
const rfs = require("rotating-file-stream");
const path = require("path");
const fs = require("fs");
const { ActivityLog } = require("../models");

// log directory path
const logDirectory = path.resolve(__dirname, "../../log");

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
const accessLogStream = rfs.createStream("access.log", {
	interval: "1d",
	path: logDirectory,
});

// custom system logger
const logActivity = async (description, type, dept, userId, transaction) => {
	await ActivityLog.create(
		{
			description,
			logType: type,
			department: dept,
			userId,
		},
		{ transaction }
	);
	return true;
};

module.exports = {
	dev: morgan("dev"),
	combined: morgan("combined", { stream: accessLogStream }),
	logActivity,
};
