module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("staffs", [
			{
				firstName: "Admin",
				lastName: "Admin",
				birthdate: "01/01/2000",
				gender: "male",
				isDeleted: true,
				email: "admin@admin.com",
				contact: "0000000000",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("staffs", null, {});
	},
};
