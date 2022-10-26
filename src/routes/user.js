const express = require("express");
const router = express.Router();

const user = require("../controllers/user.js");
const authenticateToken = require("../middleware/auth.js");

router.get("/api/accounts/:id", user.getUserById);

router.get("/api/accounts", user.getUsers);

router.post("/api/accounts/signup", user.signUp);

router.post("/api/accounts/login", user.login);

router.post("/api/accounts/change-password", user.changePassword);
router.post("/api/accounts/forgot-password", user.forgotPassword);

router.delete("/api/accounts/:id", authenticateToken, user.toggleDelete);

router.put("/api/accounts", authenticateToken, user.updateUser);

module.exports = router;
