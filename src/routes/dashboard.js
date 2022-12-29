const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const dashboard = require("../controllers/dashboard");

// routes
router.get("/api/dashboard", dashboard.summary);
router.get("/api/settings", dashboard.getSettings);
router.put("/api/settings", authenticateToken, dashboard.updateSettings);

module.exports = router;
