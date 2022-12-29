("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Outlet extends Model {
		static associate(models) {
			// define association here
			// this.belongsTo(models.Tax, {
			// 	foreignKey: "taxId",
			// 	as: "defaultTax",
			// });
			// this.belongsTo(models.User, {
			// 	foreignKey: "userId",
			// 	as: "creator",
			// });
			// this.belongsTo(models.Company, {
			// 	foreignKey: "companyId",
			// 	as: "company",
			// });
			// this.hasMany(models.Customer, {
			// 	foreignKey: "outletId",
			// 	as: "customers",
			// });
			// this.hasMany(models.Sale, {
			// 	foreignKey: "outletId",
			// 	as: "sales",
			// });
			// this.hasMany(models.Register, {
			// 	foreignKey: "outletId",
			// 	as: "registers",
			// });
			// this.hasMany(models.Product, {
			// 	foreignKey: "outletId",
			// 	as: "products",
			// });
		}
	}

	Outlet.init(
		{
			outletName: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			address: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			gps: {
				type: DataTypes.STRING,
			},

			region: {
				type: DataTypes.STRING,
			},

			city: {
				type: DataTypes.STRING,
			},

			country: {
				type: DataTypes.STRING,
			},

			phone: {
				type: DataTypes.STRING,
			},

			// foriegnKeys
			// userId: {
			// 	type: DataTypes.INTEGER,
			// 	allowNull: false,
			// 	references: {
			// 		model: "users",
			// 	},
			// 	// owner/creator
			// },
			// taxId: {
			// 	type: DataTypes.INTEGER,
			// 	allowNull: true,
			// 	references: {
			// 		model: "taxes",
			// 	},
			// 	// default tax
			// },
			// companyId: {
			// 	type: DataTypes.INTEGER,
			// 	references: {
			// 		model: "companies",
			// 	},
			// 	// parent company linked to
			// },
		},
		{
			sequelize,
			tableName: "outlets",
			modelName: "Outlet",
		}
	);
	return Outlet;
};
