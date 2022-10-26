("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class PaymentHistory extends Model {
		static associate(models) {
			// define association here
			this.belongsTo(models.Sale, {
				foreignKey: "saleId",
				as: "sale",
			});

			this.belongsTo(models.User, {
				foreignKey: "userId",
				as: "user",
			});
		}
	}
	PaymentHistory.init(
		{
			amount: {
				type: DataTypes.DECIMAL,
				defaultValue: 0.0,
			},

			// foreign keys
			saleId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "sales",
				},
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "users",
				},
			},
		},
		{
			sequelize,
			tableName: "payment_history",
			modelName: "PaymentHistory",
		}
	);
	return PaymentHistory;
};
