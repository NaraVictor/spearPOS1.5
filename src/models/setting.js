("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Setting extends Model {
		static associate(models) {
			// define association here
		}
	}
	Setting.init(
		{
			purchaseCategory: {
				type: DataTypes.STRING,
			},

			receiptAbbreviation: {
				type: DataTypes.STRING,
				defaultValue: "ABC",
			},

			addRestockExpense: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
		},
		{
			sequelize,
			tableName: "settings",
			modelName: "Setting",
		}
	);
	return Setting;
};
