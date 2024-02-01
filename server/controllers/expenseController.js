const Expenses = require("../models/expenses");
const Users = require("../models/users");
const mongoose = require("mongoose");

const createExpense = async (req, res, next) => {
  const { amount, category, description } = req.body;

  if (!amount || !category || !description) {
    res.status(400).json({
      success: true,
      message: "All fields are mandatory",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Expenses.create(
      [
        {
          amount,
          category,
          description,
          userId: req.user._id,
        },
      ],
      {
        session,
      }
    );

    await Users.updateOne(
      { _id: req.user._id },
      {
        totalExpense: Number(req.user.totalExpense) + Number(amount),
      }
    ).session(session);

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: "Unable to add expense",
    });
  } finally {
    session.endSession();
  }
};

const getExpenses = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = parseInt(req.query.rows) || 10;
  const startIndex = (page - 1) * itemsPerPage;

  const count = await Expenses.countDocuments({ userId: req.user._id });
  const expenses = await Expenses.find({ userId: req.user._id })
    .select({ userId: 0 })
    .limit(itemsPerPage)
    .skip(startIndex)
    .sort({ createdAt: -1 });

  const totalPages = Math.ceil(count / itemsPerPage);
  res.status(200).json({
    expenses,
    currentPage: page,
    totalPages,
    totalItems: count,
  });
};

const deleteExpense = async (req, res, next) => {
  const expenseId = req.params.expenseId;
  if (!expenseId) {
    return res.status(400).json({
      success: false,
      message: "Expense Id is required!",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const expenseToDelete = await Expenses.findOne({ _id: expenseId }).session(
      session
    );

    if (!expenseToDelete) {
      return res.status(404).json({
        success: false,
        message: "Expense does not exist!",
      });
    }

    await Users.findOneAndUpdate(
      { _id: req.user._id },
      { $inc: { totalExpense: -expenseToDelete.amount } },
      { session }
    );

    await expenseToDelete.deleteOne({ session }); // Delete the expense
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Expense deleted",
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  } finally {
    session.endSession();
  }
};

module.exports = { createExpense, getExpenses, deleteExpense };
