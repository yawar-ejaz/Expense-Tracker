const express = require("express");
const router = express.Router();
const { purchasePremium } = require('../controllers/purchaseController');
const auth = require("../middlewares/auth");

router.route("/premium").get(auth, purchasePremium);

module.exports = router;