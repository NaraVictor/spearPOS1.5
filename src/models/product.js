("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Product extends Model {
		static associate(models) {
			// define association here
			this.belongsTo(models.Category, {
				foreignKey: "categoryId",
				as: "category",
			});
			this.belongsTo(models.User, {
				foreignKey: "userId",
				as: "user",
			});
			this.belongsTo(models.Supplier, {
				foreignKey: "supplierId",
				as: "supplier",
			});
			// this.belongsTo(models.Outlet, {
			// 	foreignKey: "outletId",
			// 	as: "outlet",
			// });

			this.hasMany(models.SaleDetail, {
				foreignKey: "productId",
				as: "sales",
			});

			this.hasMany(models.PurchaseOrderDetail, {
				foreignKey: "productId",
				as: "purchases",
			});

			// this.belongsTo(models.Brand, {
			// 	foreignKey: {
			// 		name: "brandId",
			// 		allowNull: true,
			// 	},
			// 	as: "brand",
			// });

			// this.hasMany(models.OrderDetail, {
			// 	foreignKey: "productId",
			// 	as: "orders",
			// });
		}
	}
	Product.init(
		{
			productName: {
				type: DataTypes.STRING,
				// unique: true,
				allowNull: false,
			},
			purchasePrice: {
				type: DataTypes.DECIMAL,
				defaultValue: 0.0,
			},
			sellingPrice: {
				type: DataTypes.DECIMAL,
				defaultValue: 0.0,
			},
			quantity: {
				type: DataTypes.INTEGER,
			},

			description: { type: DataTypes.STRING },

			location: {
				type: DataTypes.STRING,
			},

			minQty: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
				comment: "product's minimum quantity the system should monitor for",
			},
			maxQty: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
				comment: "product's maximum quantity the system should monitor for",
			},
			restockQty: {
				type: DataTypes.INTEGER,
				defaultValue: 5,
				comment: "product's maximum quantity the system should monitor for",
			},

			expiryDate: {
				type: DataTypes.DATEONLY,
				allowNull: true,
			},
			createdAt: {
				type: DataTypes.DATE,
			},
			updatedAt: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},

			// booleans
			isDeleted: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},

			isAService: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				// if yes, don't track inventory
			},

			// foreign keys
			// brandId: {
			// 	type: DataTypes.INTEGER,
			// 	references: {
			// 		model: "brands",
			// 	},
			// },

			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "users",
				},
			},
			supplierId: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: "suppliers",
				},
			},

			// outletId: {
			// 	type: DataTypes.INTEGER,
			// 	allowNull: true,
			// 	references: {
			// 		model: "outlets",
			// 	},
			// },
			categoryId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "categories",
				},
			},
			// subCategoryId: {
			// 	type: DataTypes.INTEGER,
			// 	// references: {
			// 	// 	model: "sub_categories",
			// 	// },
			// },

			// auto-generated / entered
			salesCount: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
		},
		{
			sequelize,
			tableName: "products",
			modelName: "Product",
		}
	);
	return Product;
};
