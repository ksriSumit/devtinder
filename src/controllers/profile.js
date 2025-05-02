const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const saltRounds = 12;
const jwt = require("jsonwebtoken");
// Get a single user by email
const getSingleUserByEmail = async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await UserModel.find({ email: userEmail }).select("-password");
    if (user.length === 0) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send("Something Went Wrong");
  }
};

// Get all users
const getAllUser = async (req, res) => {
  const users = await UserModel.find({}).select("-password");
  if (!users) {
    return res.status(404).send("Database is empty");
  }
  return res.status(200).send(users);
};

// Delete a user by email
const deleteUser = async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await UserModel.findOne({ email: userEmail });

    if (!user)
      return res
        .status(404)
        .send("User does not exist with email: " + userEmail);

    const deleteStatus = await UserModel.findByIdAndDelete({
      _id: user._id,
    });

    if (deleteStatus && deleteStatus._id.toString() === user._id.toString()) {
      return res
        .status(200)
        .send("Deleted Successfully: " + deleteStatus.email);
    }

    return res.status(400).send("Something Went Wrong");
  } catch (error) {
    res.status(500).send("Something Went Wrong");
  }
};

// Update user profile
const updateUser = async (req, res) => {
  try {
    const user = await UserModel.findById({ _id: req.user._id });

    if (!user)
      return res.status(404).json({
        success: false,
        message: "Invalid Credentials",
      });

    const updateStatus = await UserModel.findByIdAndUpdate(
      {
        _id: user._id,
      },
      req.body,
      { returnDocument: "after", select: "-password -__v -refreshToken" }
    );

    if (updateStatus && updateStatus._id.toString() === user._id.toString()) {
      return res.status(200).send(updateStatus);
    }

    res.status(400).json({
      success: false,
      message: "Update failed",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// View current user's profile
const viewProfile = async (req, res) => {
  try {
    if (Object.keys(req.body).length > 0) {
      return res.status(400).json({
        success: false,
        error: "GET requests must not include a body.",
      });
    }
    const user = await UserModel.findById({ _id: req.user._id }).select(
      "-password -__v -refreshToken"
    );
    if (!user) throw new Error();
    res.status(200).send(user);
  } catch (error) {
    res.status(404).json({
      success: false,
      errorMessage: error.message,
    });
  }
};

// Change Current User Password
const changePassword = async (req, res) => {
  try {
    const user = await UserModel.findById({ _id: req.user._id });
    if (!user)
      return res.status(404).json({
        success: false,
        message: "Invalid Credentials",
      });
    const passwordHash = await bcrypt.hash(req.body.newPassword, saltRounds);
    const newTokenVersion = user.tokenVersion + 1;
    const updateStatus = await UserModel.findByIdAndUpdate(
      {
        _id: user._id,
      },
      { password: passwordHash, tokenVersion: newTokenVersion },
      { returnDocument: "after" }
    );
    const token = await updateStatus.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, //1 day
    });
    return res.status(200).json({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Export all user controllers
module.exports = {
  getSingleUserByEmail,
  getAllUser,
  deleteUser,
  updateUser,
  viewProfile,
  changePassword,
};
