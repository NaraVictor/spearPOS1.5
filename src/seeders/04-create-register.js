module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("registers", [
			{
				name: "Main Register",
				userId: 1,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("registers", null, {});
	},
};
