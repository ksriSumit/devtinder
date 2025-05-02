const connectionRequestModel = require("../models/connectionRequestModel");
const receivedConnectionRequest = async (req, res) => {
  try {
    if (Object.keys(req.body).length > 0) {
      return res.status(400).json({
        success: false,
        error: "GET requests must not include a body.",
      });
    }
    const loggedInUser = req.user;
    const data = await connectionRequestModel
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "skills",
        "about",
        "gender",
        "photoUrl",
        "-_id",
      ])
      .select("-__v -createdAt -updatedAt");
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { receivedConnectionRequest };
