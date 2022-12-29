const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");

const company = require("../controllers/company");
const companyValidator = require("../middleware/company");

// routes
// router.get("/api/company/:id", company.getCompanyById);

router.get("/api/company", company.getCompanies);

router.post(
	"/api/company",
	authenticateToken,
	companyValidator,
	company.newCompany
);

router.put(
	"/api/company",
	authenticateToken,
	companyValidator,
	company.updateCompany
);

module.exports = router;
