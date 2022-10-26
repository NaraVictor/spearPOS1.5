("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class SubCategory extends Model {
		static associate(models) {
			// define association here
			this.belongsTo(models.Category, {
				foreignKey: "categoryId",
				as: "parentCategory",
			});

			// constraint issues forced me to comment it for now.
			// cant figure out how to allow nulls on products side yet
			// this.hasMany(models.Product, {
			// 	foreignKey: {
			// 		name: "subCategoryId",
			// 		allowNull: true,
			// 	},
			// 	as: "products",
			// });
		}
	}
	SubCategory.init(
		{
			categoryId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "categories",
				},
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING,
			},
		},
		{
			sequelize,
			tableName: "sub_categories",
			modelName: "SubCategory",
		}
	);
	return SubCategory;
};
