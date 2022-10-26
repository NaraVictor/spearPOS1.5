("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Register extends Model {
		static associate(models) {
			// define association here
			this.belongsTo(models.User, {
				foreignKey: "userId",
				as: "user",
			});
			// this.belongsTo(models.Outlet, {
			// 	foreignKey: "outletId",
			// 	as: "outlet",
			// });
			this.hasMany(models.RegisterSequence, {
				foreignKey: "registerId",
				as: "sequences",
			});
		}
	}

	Register.init(
		{
			// only one register per outlet for now
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			// foreign keys
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "users",
				},
			},
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
			tableName: "registers",
			modelName: "Register",
		}
	);
	return Register;
};
