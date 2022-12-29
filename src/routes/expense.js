const express = require("express");
const router = express.Router();

const expense = require("../controllers/expense");
const authenticateToken = require("../middleware/auth");
const expenseMiddleWare = require("../middleware/expense");

// routes
router.get("/api/expenses/:id", expense.getExpenseById);

router.get("/api/expenses", expense.getExpenses);

router.post(
	"/api/expenses",
	authenticateToken,
	expenseMiddleWare,
	expense.newExpense
);

router.delete("/api/expenses/:id", authenticateToken, expense.deleteExpense);

router.put("/api/expenses", authenticateToken, expense.updateExpense);

module.exports = router;
