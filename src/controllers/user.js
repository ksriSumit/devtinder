const UserModel = require("../models/userModel");

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

const getAllUser = async (req, res) => {
  const users = await UserModel.find({}).select("-password");
  if (!users) {
    return res.status(404).send("Database is empty");
  }
  return res.status(200).send(users);
};

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

const updateUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user)
      return res
        .status(404)
        .send("User does not exist with email: " + req.body.email);

    const updateStatus = await UserModel.findByIdAndUpdate(
      {
        _id: user._id,
      },
      { email: req.body.newEmail },
      { returnDocument: "after" }
    );

    if (updateStatus && updateStatus._id.toString() === user._id.toString()) {
      return res
        .status(200)
        .send("Email Address Updated to: " + updateStatus.email);
    }

    res.status(400).send("Something Went Wrong");
  } catch (error) {
    res.status(500).send("Something Went Wrong");
  }
};

module.exports = { getSingleUserByEmail, getAllUser, deleteUser, updateUser };
