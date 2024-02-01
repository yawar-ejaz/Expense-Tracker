const validator = require("validator");
const Users = require("../models/users");
const ResetPassword = require("../models/resetPassword");
const { encrypt, isMatching } = require("../utils/hashing");
const createToken = require("../utils/createToken");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are Mandatory!",
    });
  }

  try {
    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email id already exists",
      });
    }

    const user = await Users.create({
      name,
      email,
      password: await encrypt(password),
    });

    const token = createToken(user._id);
    res.status(201).json({
      success: true,
      token,
      name: user.name,
      email: user.email,
      isPremium: user.isPremium,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to add user to the database!",
    });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const existingUser = await Users.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not exists!",
      });
    }

    if (await isMatching(password, existingUser.password)) {
      const token = createToken(existingUser._id);
      return res.status(200).json({
        success: true,
        token,
        name: existingUser.name,
        email: existingUser.email,
        isPremium: existingUser.isPremium,
        message: "User logged in!",
      });
    }

    res.status(401).json({
      success: false,
      message: "Incorrect password",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};

const sendResetLink = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "email is required!",
    });
  }

  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user found with this email id",
      });
    }
    const temporaryToken = uuidv4();
    await ResetPassword.create({
      token: temporaryToken,
      userId: user._id,
    });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    // Send the password reset email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Password for Expensify Account",
      html: `To reset your password <a href="${process.env.CLIENT_ADDRESS}/reset-password?token=${temporaryToken}">Click Here</a>`,
    });

    return res.status(200).json({
      success: true,
      message: "E-mail sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send mail",
    });
  }
};

const verifyToken = async (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token not found",
    });
  }
  try {
    const forgottenPasswordRequest = await ResetPassword.findOne({ token });

    if (forgottenPasswordRequest) {
      const expiresInDate = new Date(forgottenPasswordRequest.expiresIn);
      const currentDate = new Date();
      if (expiresInDate < currentDate) {
        //check if session exists
        res.status(400).json({
          success: false,
          message: "token invalid",
        });
      }

      return res.status(200).json({
        success: true,
        message: "token valid",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "token invalid",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: "token invalid",
    });
  }
};

const resetPassword = async (req, res, next) => {
  const { password, token } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const forgottenPasswordRequest = await ResetPassword.findOne({ token });

    const user = await Users.updateOne(
      { _id: forgottenPasswordRequest.userId },
      { password: await encrypt(password) }
    ).session(session);

    await ResetPassword.deleteOne({ token }).session(session);

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    return res.status(404).json({
      success: false,
      message: "password could not be updated. Token invalid",
    });
  } finally {
    session.endSession();
  }
};

module.exports = {
  createUser,
  login,
  sendResetLink,
  verifyToken,
  resetPassword,
};
