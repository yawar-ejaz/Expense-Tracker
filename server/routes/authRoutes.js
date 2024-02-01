const express = require("express")
const router = express.Router();
const { createUser, login, sendResetLink, verifyToken, resetPassword } = require('../controllers/authController');

router.route("/sign-up").post(createUser);
router.route("/sign-in").post(login);
router.route("/get-otp").post(sendResetLink);
router.route("/verify-token").post(verifyToken);
router.route("/reset-password").post(resetPassword);

module.exports = router;