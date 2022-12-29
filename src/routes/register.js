const express = require("express");
const router = express.Router();

const register = require("../controllers/register");
const authenticateToken = require("../middleware/auth");
const {
	registerSequenceValidator,
	registerPaymentValidator,
} = require("../middleware/register");

router.get("/api/registers/:id", register.getRegisterById);
router.get("/api/registers", register.getRegisters);
router.get("/api/registers/previous", register.getPreviousRegister);

router.post(
	"/api/registers/open",
	authenticateToken,
	registerSequenceValidator,
	register.openRegister
);
router.post(
	"/api/registers/close",
	authenticateToken,
	registerPaymentValidator,
	register.closeRegister
);

router.delete("/api/registers/:id", authenticateToken, register.deleteRegister);
// router.put("/api/registers", register.updateRegister);

module.exports = router;
