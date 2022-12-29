("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Staff extends Model {
		static associate(models) {
			// define association here
			this.hasOne(models.User, {
				foreignKey: "staffId",
				as: "userAccount",
			});
		}
	}
	Staff.init(
		{
			firstName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			birthdate: {
				type: DataTypes.DATEONLY,
				allowNull: false,
			},
			gender: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			contact: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
			},
			position: {
				type: DataTypes.STRING,
			},
			staffType: {
				type: DataTypes.STRING,
			},
			imageUrl: {
				type: DataTypes.STRING,
			},

			isDeleted: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},

			// foreign keys
			departmentId: {
				type: DataTypes.INTEGER,
			},
		},
		{
			sequelize,
			tableName: "staffs",
			modelName: "Staff",
		}
	);
	return Staff;
};
