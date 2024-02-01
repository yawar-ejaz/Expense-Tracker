const jwt = require("jsonwebtoken");
const User = require("../models/users");
const mongoose = require("mongoose");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).json({
      success: false,
      message: "Authorization token Required!",
    });
  }
  const token = authorization.split(" ")[1];
  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      res.status(401).json({
        success: false,
        message: "Unauthorised user",
      });
    }

    const user = await User.findById(_id).select("-password");
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorised user",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized access!",
    });
  }
};

module.exports = requireAuth;
