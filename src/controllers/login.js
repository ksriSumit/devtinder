const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find user and explicitly exclude fields we don't want
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // Compare passwords correctly
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = await user.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, //1 day
    });

    // Create a clean user object without sensitive fields
    const userWithoutSensitiveFields = user.toObject();
    delete userWithoutSensitiveFields.password;
    delete userWithoutSensitiveFields.__v;
    delete userWithoutSensitiveFields.tokenVersion;
    delete userWithoutSensitiveFields.created_on;
    delete userWithoutSensitiveFields.updated_on;

    return res.status(200).json({
      success: true,
      data: userWithoutSensitiveFields,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = login;
