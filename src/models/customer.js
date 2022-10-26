("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Customer extends Model {
		static associate(models) {
			// define association here
			this.hasMany(models.Sale, {
				foreignKey: "customerId",
				as: "sales",
			});
			// this.belongsTo(models.Outlet, {
			// 	foreignKey: "outletId",
			// 	as: "outlet",
			// });
		}
	}
	Customer.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			primaryContact: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			secondaryContact: {
				type: DataTypes.STRING,
			},
			email: {
				type: DataTypes.STRING,
			},
			address: {
				type: DataTypes.STRING,
			},
			category: {
				// person | organization
				type: DataTypes.STRING,
			},
			gender: {
				type: DataTypes.STRING,
			},
			isDeleted: {
				type: DataTypes.BOOLEAN,
			},

			// foreign keys
			// outletId: {
			// 	type: DataTypes.INTEGER,
			// 	allowNull: false,
			// 	references: {
			// 		model: "outlets",
			// 	},
			// },
		},
		{
			sequelize,
			tableName: "customers",
			modelName: "Customer",
		}
	);
	return Customer;
};
