const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Await the database query
    const user = await userModel.findOne({ email });

    // Compare passwords correctly
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, //1 day
      });
      return res.status(200).json({
        success: true,
        id: user._id,
        email: user.email,
        name: user.name,
      });
    } else {
      return res.status(401).send("Invalid Credentials");
    }
  } catch (error) {
    return res.status(400).send(`${error.message}`);
  }
};

module.exports = login;
