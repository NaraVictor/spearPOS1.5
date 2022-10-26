const express = require("express");
const router = express.Router();

const audits = require("../controllers/audits.js");

// routes

// basic crud routes
router.get("/api/audits/sales", audits.getSalesAudits);
router.get("/api/audits/products", audits.getProductsAudits);
router.get("/api/audits/expenses", audits.getExpensesAudits);
router.get("/api/audits/purchases", audits.getPurchasesAudits);
router.get("/api/audits/charts", audits.getCharts);

module.exports = router;
