const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const customerValidator = require("../middleware/customer");
const customer = require("../controllers/customer");

// routes
router.get("/api/customers/:id", customer.getCustomerById);

router.get("/api/customers", customer.getCustomers);

router.post(
	"/api/customers",
	authenticateToken,
	customerValidator,
	customer.newCustomer
);

router.put(
	"/api/customers",
	authenticateToken,
	customerValidator,
	customer.updateCustomer
);

router.delete("/api/customers/:id", authenticateToken, customer.deleteCustomer);

module.exports = router;
