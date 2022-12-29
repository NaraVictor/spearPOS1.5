("use strict");
const { Model, DATE } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Sale extends Model {
		static associate(models) {
			// define association here
			this.hasMany(models.SaleDetail, {
				foreignKey: "saleId",
				as: "details",
			});

			this.hasMany(models.PaymentHistory, {
				foreignKey: "saleId",
				as: "payments",
			});

			this.belongsTo(models.User, {
				foreignKey: "userId",
				as: "user",
			});

			this.belongsTo(models.Customer, {
				foreignKey: "customerId",
				as: "customer",
			});

			// this.belongsTo(models.Outlet, {
			// 	foreignKey: "outletId",
			// 	as: "outlet",
			// });
		}
	}
	Sale.init(
		{
			sumAmt: {
				//total
				type: DataTypes.DECIMAL,
				defaultValue: 0.0,
			},
			paymentMethod: {
				type: DataTypes.STRING,
			},
			receiptNumber: {
				type: DataTypes.STRING,
			},
			remark: {
				type: DataTypes.STRING,
			},
			amountPaid: {
				type: DataTypes.DECIMAL,
				allowNull: false,
				defaultValue: 0.0,
			},
			discount: {
				type: DataTypes.DECIMAL,
				defaultValue: 0.0,
			},
			saleDate: {
				type: DataTypes.DATEONLY,
				defaultValue: DataTypes.NOW,
			},

			// foreign keys
			customerId: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: "customers",
				},
			},
			// taxId: {
			// 	type: DataTypes.INTEGER,
			// 	allowNull: true,
			// 	references: {
			// 		model: "taxes",
			// 	},
			// },
			// outletId: {
			// 	type: DataTypes.INTEGER,
			// 	allowNull: true,
			// 	references: {
			// 		model: "outlets",
			// 	},
			// },
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
			tableName: "sales",
			modelName: "Sale",
		}
	);
	return Sale;
};
