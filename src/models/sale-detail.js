("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class SaleDetail extends Model {
		static associate(models) {
			// define association here
			this.belongsTo(models.Sale, {
				foreignKey: "saleId",
				as: "sale",
			});

			this.belongsTo(models.Product, {
				foreignKey: "productId",
				as: "product",
			});
		}
	}
	SaleDetail.init(
		{
			quantity: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			unitPrice: {
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
			productId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "products",
				},
			},
		},
		{
			sequelize,
			tableName: "saleDetails",
			modelName: "SaleDetail",
		}
	);
	return SaleDetail;
};
