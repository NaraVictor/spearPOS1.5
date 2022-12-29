("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class ActivityLog extends Model {
		static associate(models) {
			// define association here
			this.belongsTo(models.User, {
				foreignKey: "userId",
				as: "user",
			});
		}
	}
	ActivityLog.init(
		{
			description: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			department: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			logType: {
				type: DataTypes.STRING,
				//info, error
			},
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
			tableName: "activity_logs",
			modelName: "ActivityLog",
		}
	);
	return ActivityLog;
};
