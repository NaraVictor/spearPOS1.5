const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/auth");
const category = require("../controllers/category");

// routes
router.get("/api/categories/:id", category.getCategoryById);
router.get("/api/categories", category.getCategories);

router.get("/api/categories/:id/subcategories", category.getSubCategories);

router.post("/api/categories", authenticateToken, category.newCategory);

router.delete(
	"/api/categories/:id",
	authenticateToken,
	category.deleteCategory
);

router.put("/api/categories", authenticateToken, category.updateCategory);

module.exports = router;
