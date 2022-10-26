("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Brand extends Model {
		static associate(models) {
			// define association here
			// this.hasMany(models.Product, {
			// 	as: "products",
			// 	foreignKey: "brandId",
			// });
		}
	}
	Brand.init(
		{
			brand: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING,
			},
		},
		{
			sequelize,
			tableName: "brands",
			modelName: "Brand",
		}
	);
	return Brand;
};
