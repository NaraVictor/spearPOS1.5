("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class PurchaseOrderDetail extends Model {
		static associate(models) {
			// define association here
			// this.belongsTo(models.Supplier, {
			// 	foreignKey: "supplierId",
			// 	as: "supplier",
			// });
			this.belongsTo(models.Product, {
				foreignKey: "productId",
				as: "product",
			});
			this.belongsTo(models.PurchaseOrder, {
				foreignKey: "purchaseOrderId",
				as: "purchase_order",
			});
		}
	}
	PurchaseOrderDetail.init(
		{
			purchaseOrderId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "purchase_orders",
				},
			},
			productId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "products",
				},
			},
			// supplierId: {
			// 	type: DataTypes.INTEGER,
			// 	allowNull: false,
			// 	references: {
			// 		model: "suppliers",
			// 	},
			// },

			availableQty: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
			restockQty: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
			unitPrice: {
				type: DataTypes.DECIMAL,
				defaultValue: 0.0,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: "purchase_order_details",
			modelName: "PurchaseOrderDetail",
		}
	);
	return PurchaseOrderDetail;
};
