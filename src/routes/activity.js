const express = require("express");
const router = express.Router();

const logs = require("../controllers/activity-log");
const authenticateToken = require("../middleware/auth");
// routes
router.get("/api/logs", logs.getLogs);
router.get("/api/logs/:userId", logs.getUserLogs);
router.delete("/api/logs", authenticateToken, logs.deleteLogs);
router.delete("/api/logs/:id", authenticateToken, logs.deleteLog);

module.exports = router;
