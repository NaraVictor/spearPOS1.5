("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class RegisterSequence extends Model {
		static associate(models) {
			// define association here
			this.belongsTo(models.User, {
				foreignKey: "userId",
				as: "user",
			});
			this.belongsTo(models.Register, {
				foreignKey: "registerId",
				as: "register",
			});
			// this.belongsTo(models.Outlet, {
			// 	foreignKey: "outletId",
			// 	as: "outlet",
			// });
			this.hasMany(models.RegisterPayment, {
				foreignKey: "registerSequenceId",
				as: "payments",
			});
		}
	}

	RegisterSequence.init(
		{
			sequence: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
				allowNull: false,
				// sequence or position of register... serial number or so
			},
			openTime: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			closeTime: {
				type: DataTypes.DATE,
			},
			openingFloat: {
				type: DataTypes.DECIMAL,
				defaultValue: 0.0,
				allowNull: false,
				// opening balance
			},
			openingNote: {
				type: DataTypes.STRING,
			},
			closingNote: {
				type: DataTypes.STRING,
			},
			isClosed: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},

			// foreign keys
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "users",
				},
			},
			registerId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "registers",
				},
			},
		},
		{
			sequelize,
			tableName: "register_sequences",
			modelName: "RegisterSequence",
		}
	);
	return RegisterSequence;
};
