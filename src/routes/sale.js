const express = require("express");
const router = express.Router();

const sale = require("../controllers/sale");
const authenticateToken = require("../middleware/auth");

router.get("/api/sales/:id", sale.getSaleById);
router.get("/api/sales", sale.getSales);
router.get("/api/sales-debtors", sale.getDebtors);
router.get("/api/sales/:id/payments", sale.getPayments);

router.post("/api/sales", authenticateToken, sale.newSale);
router.post("/api/sales/reverse/:id", authenticateToken, sale.reverseSale);

router.delete("/api/sales/:id", authenticateToken, sale.deleteSale);

router.delete("/api/sales/:id/payments", authenticateToken, sale.deletePayment);
router.post("/api/sales/:id/payments", authenticateToken, sale.makePayment);

router.put("/api/sales", sale.updateSale);

module.exports = router;
