const express = require("express");
const router = express.Router();

const supplierController = require("../controllers/supplier");
const supplierValidator = require("../middleware/supplier");
const authenticateToken = require("../middleware/auth");

// routes
router.get("/api/suppliers/:id", supplierController.getSupplierById);
router.get("/api/suppliers", supplierController.getSuppliers);
router.get(
	"/api/suppliers/:id/products",
	supplierController.getSupplierProducts
);

router.post(
	"/api/suppliers",
	authenticateToken,
	supplierValidator,
	supplierController.newSupplier
);

router.put(
	"/api/suppliers",
	authenticateToken,
	supplierValidator,
	supplierController.updateSupplier
);

router.delete(
	"/api/suppliers/:id",
	authenticateToken,
	supplierController.deleteSupplier
);

module.exports = router;
