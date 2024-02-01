const express = require("express")
const router = express.Router();
const { createExpense, getExpenses, deleteExpense } = require("../controllers/expenseController");
const auth = require("../middlewares/auth");

router.route("/").post(auth, createExpense);// the request will travel to the middleware first and then to createExpense
router.route("/").get(auth, getExpenses);// the request will travel to the middleware first and then to createExpense
router.route("/:expenseId").delete(auth, deleteExpense);// the request will travel to the middleware first and then to createExpense

module.exports = router;