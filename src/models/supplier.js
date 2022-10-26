("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Supplier extends Model {
		static associate(models) {
			// define association here
			this.hasMany(models.Product, {
				foreignKey: "supplierId",
				as: "products",
			});
		}
	}
	Supplier.init(
		{
			supplierName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			location: {
				type: DataTypes.STRING,
			},
			contact: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
			},
		},
		{
			sequelize,
			tableName: "suppliers",
			modelName: "Supplier",
		}
	);
	return Supplier;
};
