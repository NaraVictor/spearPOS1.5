("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Category extends Model {
		static associate(models) {
			// define association here
			this.hasMany(models.Expense, {
				foreignKey: "categoryId",
			});
			this.hasMany(models.Product, {
				foreignKey: "categoryId",
				as: "products",
			});
			this.hasMany(models.SubCategory, {
				foreignKey: "categoryId",
				as: "subCategories",
			});
		}
	}
	Category.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING,
			},
			type: {
				type: DataTypes.STRING,
				allowNull: false,
				comment: "indicates if category is for products or expenses",
				// for either expense or product
			},
			isDeleted: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
		},
		{
			sequelize,
			tableName: "categories",
			modelName: "Category",
		}
	);
	return Category;
};
