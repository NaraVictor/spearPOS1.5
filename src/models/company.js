("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Company extends Model {
		static associate(models) {
			// define association here
			// define association here
			// this.hasMany(models.Outlet, {
			// 	foreignKey: "companyId",
			// 	as: "outlets",
			// });

			this.belongsTo(models.User, {
				foreignKey: "userId",
				as: "user",
			});
		}
	}
	Company.init(
		{
			companyName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			primaryContact: {
				type: DataTypes.STRING,
				// allowNull: false,
			},
			secondaryContact: {
				type: DataTypes.STRING,
			},
			email: {
				type: DataTypes.STRING,
			},
			// website: {
			// 	type: DataTypes.STRING,
			// },
			address: {
				type: DataTypes.STRING,
			},
			VAT: {
				type: DataTypes.STRING,
			},
			TIN: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			logo: {
				type: DataTypes.STRING,
			},
			gps: {
				type: DataTypes.STRING,
			},

			// new
			// companyName: {
			// 	type: DataTypes.STRING,
			// 	allowNull: false,
			// },
			// phone: {
			// 	type: DataTypes.STRING,
			// 	// allowNull: false,
			// },
			// email: {
			// 	type: DataTypes.STRING,
			// 	allowNull: false,
			// },
			// category: {
			// 	type: DataTypes.STRING,
			// 	// allowNull: false,
			// },
			// website: {
			// 	type: DataTypes.STRING,
			// },
			// TIN: {
			// 	type: DataTypes.STRING,
			// 	allowNull: false,
			// },
			// logo: {
			// 	type: DataTypes.STRING,
			// },

			// foreign key
			userId: {
				type: DataTypes.INTEGER,
				// allowNull: false,
				references: {
					model: "users",
				},
			},
		},
		{
			sequelize,
			tableName: "companies",
			modelName: "Company",
		}
	);
	return Company;
};
