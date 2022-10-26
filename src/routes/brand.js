const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const brand = require("../controllers/brand");

// routes
router.get("/api/brands/:id", authenticateToken, brand.getBrandById);

router.get("/api/brands", brand.getBrands);

router.post("/api/brands", brand.newBrand);

router.delete("/api/brands/:id", brand.deleteBrand);

router.put("/api/brands", brand.updateBrand);

module.exports = router;
