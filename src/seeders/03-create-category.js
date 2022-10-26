module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("categories", [
			{
				name: "Item",
				type: "product",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("categories", null, {});
	},
};
