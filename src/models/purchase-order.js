("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class PurchaseOrder extends Model {
		static associate(models) {
			// define association here
			this.belongsTo(models.User, {
				foreignKey: "userId",
				as: "user",
			});
			// this.belongsTo(models.User, {
			// 	foreignKey: "approvedBy",
			// 	as: "approver",
			// });
			this.hasMany(models.PurchaseOrderDetail, {
				foreignKey: "purchaseOrderId",
				as: "details",
			});
		}
	}
	PurchaseOrder.init(
		{
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "users",
				},
			},
			sumAmt: {
				type: DataTypes.DECIMAL,
				defaultValue: 0.0,
			},
			sumQty: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			productCount: {
				type: DataTypes.INTEGER,
			},
			comment: {
				type: DataTypes.STRING,
			},
			// approved: {
			// 	type: DataTypes.BOOLEAN,
			// 	defaultValue: false,
			// },
			// approvedBy: {
			// 	type: DataTypes.INTEGER,
			// 	allowNull: true,
			// 	references: {
			// 		model: "users",
			// 	},
			// },
		},
		{
			sequelize,
			tableName: "purchase_orders",
			modelName: "PurchaseOrder",
		}
	);
	return PurchaseOrder;
};
