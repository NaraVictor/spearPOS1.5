const express = require("express");
const router = express.Router();

const staffController = require("../controllers/staff");
const authenticateToken = require("../middleware/auth");

// routes
router.get("/api/staffs/:id", staffController.getStaffById);

router.get("/api/staffs", staffController.getStaffs);

router.post("/api/staffs", staffController.newStaff);

router.delete(
	"/api/staffs/:id",
	authenticateToken,
	staffController.deleteStaff
);

router.put("/api/staffs", authenticateToken, staffController.updateStaff);

module.exports = router;
