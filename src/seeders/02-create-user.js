module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("users", [
			{
				staffId: 1,
				username: "superuser", //previous versions its: admin
				password:
					"$2a$10$fgaDFnqagkXie0fjdeS1p.EKCxEiF2WTjjyee1SzWAhFScKp2AeCe",
				role: "admin",
				email: "admin@admin.com",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("users", null, {});
	},
};
