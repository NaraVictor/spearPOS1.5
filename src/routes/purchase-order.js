const express = require("express");
const router = express.Router();

const purchaseOrderController = require("../controllers/purchase-order");
const authenticateToken = require("../middleware/auth");

// routes
router.get(
	"/api/purchase-orders/:id",
	purchaseOrderController.getPurchaseOrderById
);

router.get("/api/purchase-orders", purchaseOrderController.getPurchaseOrders);

router.post(
	"/api/purchase-orders",
	authenticateToken,
	purchaseOrderController.newPurchaseOrder
);

router.delete(
	"/api/purchase-orders/:id",
	authenticateToken,
	purchaseOrderController.deletePurchaseOrder
);

router.put(
	"/api/purchase-orders",
	authenticateToken,
	purchaseOrderController.updatePurchaseOrder
);

module.exports = router;
