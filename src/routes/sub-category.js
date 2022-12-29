const express = require("express");
const router = express.Router();

const category = require("../controllers/sub-category");
const authenticateToken = require("../middleware/auth");

// routes
router.get("/api/sub-categories/:id", category.getSubCategoryById);

router.get("/api/sub-categories", category.getSubCategories);

router.post("/api/sub-categories", authenticateToken, category.newSubCategory);

router.delete(
	"/api/sub-categories/:id",
	authenticateToken,
	category.deleteSubCategory
);

router.put(
	"/api/sub-categories",
	authenticateToken,
	category.updateSubCategory
);

module.exports = router;
