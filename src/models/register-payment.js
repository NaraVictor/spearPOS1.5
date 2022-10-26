("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class RegisterPayment extends Model {
		static associate(models) {
			// define association here
			this.belongsTo(models.RegisterSequence, {
				foreignKey: "registerSequenceId",
				as: "register_sequence",
			});
		}
	}
	RegisterPayment.init(
		{
			paymentType: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			expected: {
				type: DataTypes.DECIMAL,
				defaultValue: 0.0,
			},
			counted: {
				type: DataTypes.DECIMAL,
				defaultValue: 0.0,
			},
			difference: {
				type: DataTypes.DECIMAL,
				defaultValue: 0.0,
			},

			// foreign keys
			registerSequenceId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "register_sequences",
				},
			},
		},
		{
			sequelize,
			tableName: "register_payments",
			modelName: "RegisterPayment",
		}
	);
	return RegisterPayment;
};
