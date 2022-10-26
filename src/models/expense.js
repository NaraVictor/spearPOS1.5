("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Expense extends Model {
		static associate(models) {
			// define association here
			this.belongsTo(models.User, {
				foreignKey: "userId",
				as: "user",
			});

			this.belongsTo(models.Category, {
				foreignKey: "categoryId",
				as: "category",
			});
		}
	}
	Expense.init(
		{
			description: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			amount: {
				type: DataTypes.DECIMAL,
				allowNull: false,
				defaultValue: 0.0,
			},
			date: {
				type: DataTypes.DATEONLY,
				defaultValue: Date.now(),
			},

			// foreign keys
			categoryId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "categories",
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
			tableName: "expenses",
			modelName: "Expense",
		}
	);
	return Expense;
};
