const Razorpay = require("razorpay");
const Users = require("../models/users");
const Expenses = require("../models/expenses");
const Downloads = require("../models/downloads");
const { Op } = require("sequelize");
const crypto = require("crypto");
const { Parser } = require("json2csv");
const uploadToS3 = require("../utils/upload");

const verifyPremiumMembership = async (req, res, next) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: "Order not verified",
    });
  }

  const generatedSignature = crypto
    .createHmac("SHA256", process.env.RAZOR_PAY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  const isValid = generatedSignature == razorpay_signature;
  if (isValid) {
    try {
      await Users.findOneAndUpdate({ _id: req.user._id }, { isPremium: true });

      res.status(200).json({
        success: true,
        message: "Payment Successful!",
      });
    } catch (error) {
      t.rollback();
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal server error!",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Payment Not Successful!",
    });
  }
};

const getLeaderboard = async (req, res, next) => {
  console.log("yaha pahunch gaya");
  try {
    const result = await Users.find({})
      .select({
        name: 1,
        isPremium: 1,
        totalExpense: 1,
      })
      .sort({ totalExpense: -1 });

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

const getReport = async (req, res, next) => {
  const type = req.query.type;
  const user = req.user;

  if (type != "monthly" && type != "yearly") {
    return res.status(400).json({
      success: false,
      message: "Invalid type specified",
    });
  }

  const currentDate = new Date();
  const startDate = new Date(currentDate);

  if (type == "monthly") {
    startDate.setMonth(currentDate.getMonth() - 1);
  } else if (type == "yearly") {
    startDate.setFullYear(currentDate.getFullYear() - 1);
  }
  try {
    const expenses = await Expenses.find({
      userId: user._id,
      createdAt: { $gte: startDate },
    })
      .select({ createdAt: 1, description: 1, category: 1, amount: 1 })
      .sort({ createdAt: -1 });


    if (expenses.length == 0) {
      return res.status(404).json({
        success: false,
        message: "There are no expenses to download",
      });
    }

    //generate csv
    const data = [];
    expenses.forEach((element) => {
      const { createdAt, description, category, amount } = element;
      data.push({ createdAt, category, description, amount });
    });
    const fileName = `Expensify-${user._id}/${new Date()}.csv`;
    const csvFields = ["createdAt", "category", "description", " amount"];
    const csvParser = new Parser(csvFields);
    const csv = csvParser.parse(data);
    const fileUrl = await uploadToS3(csv, fileName);

    await Downloads.create({ url: fileUrl, userId: user._id });

    return res.status(200).json({
      url: fileUrl,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

module.exports = { verifyPremiumMembership, getLeaderboard, getReport };
