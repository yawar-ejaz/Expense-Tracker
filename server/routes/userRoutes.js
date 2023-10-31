const express = require("express")
const router = express.Router();
const { getExpenses, getParticularExpense, createExpense, updateExpense, deleteExpense } = require('../controllers/userControllers');

router.route("/").get(getExpenses)
router.route("/:id").get(getParticularExpense)
router.route("/").post(createExpense)
router.route("/:id").put(updateExpense);
router.route("/:id").delete(deleteExpense);

module.exports = router;