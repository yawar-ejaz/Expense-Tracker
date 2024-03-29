const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      allowNull: false,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Expenses = mongoose.model("Expenses", ExpenseSchema);

module.exports = Expenses;
