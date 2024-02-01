const express = require("express")
const router = express.Router();
const auth = require("../middlewares/auth");
const isPremium = require("../middlewares/isPremium");

const { verifyPremiumMembership, getLeaderboard, getReport } = require('../controllers/premiumController');

router.route("/verify").post(auth, verifyPremiumMembership);
router.route("/leaderboard").get(isPremium, getLeaderboard);
router.route("/report").get(isPremium, getReport);

module.exports = router;