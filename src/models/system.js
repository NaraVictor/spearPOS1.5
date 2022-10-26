("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class System extends Model {
		static associate(models) {
			// define association here
		}
	}
	System.init(
		{
			version: {
				type: DataTypes.STRING,
			},
			plan: {
				type: DataTypes.STRING,
				// basic, pro, etc packages
			},
			serialNo: {
				type: DataTypes.STRING,
			},
			macAddress: {
				type: DataTypes.STRING,
			},
			isRegistered: {
				type: DataTypes.BOOLEAN,
			},
			registrationDate: {
				type: DataTypes.DATEONLY,
			},
		},
		{
			sequelize,
			tableName: "system",
			modelName: "System",
		}
	);
	return System;
};
