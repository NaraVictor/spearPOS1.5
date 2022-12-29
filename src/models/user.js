("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			// define association here
			this.hasMany(models.Sale, {
				foreignKey: "userId",
				as: "sales",
			});

			this.hasMany(models.Expense, {
				foreignKey: "userId",
				as: "expenses",
			});

			this.hasMany(models.ActivityLog, {
				foreignKey: "userId",
				as: "activities",
			});
			this.hasMany(models.PurchaseOrder, {
				foreignKey: "userId",
				as: "purchase_orders",
			});

			this.hasMany(models.PaymentHistory, {
				foreignKey: "userId",
				as: "payments_history",
			});

			this.belongsTo(models.Staff, {
				foreignKey: "staffId",
				as: "staff",
			});
		}
	}
	User.init(
		{
			staffId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "staffs",
				},
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			role: {
				type: DataTypes.STRING,
			},
			email: {
				type: DataTypes.STRING,
				unique: true,
			},
			isDeleted: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
		},
		{
			sequelize,
			tableName: "users",
			modelName: "User",
		}
	);
	return User;
};
