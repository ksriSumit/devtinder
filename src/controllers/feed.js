const ConnectionRequestModel = require("../models/connectionRequestModel");
const UserModel = require("../models/userModel");
const feed = async (req, res) => {
  try {
    if (Object.keys(req.body).length > 0) {
      return res.status(400).json({
        success: false,
        error: "GET requests must not include a body.",
      });
    }
    // Validate and parse pagination
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        error: "Invalid pagination parameters",
      });
    }
    const skip = (page - 1) * limit;

    const loggedInUser = req.user;

    const interactedUsers = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    });

    const interactedUserIds = interactedUsers.map((conn) =>
      conn.fromUserId.equals(loggedInUser._id) ? conn.toUserId : conn.fromUserId
    );

    const uniqueUserIds = [...new Set(interactedUserIds)];
    const data = await UserModel.find({
      $and: [
        { _id: { $nin: uniqueUserIds } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .skip(skip)
      .limit(limit)
      .select("-email -password -updated_on -__v -tokenVersion");
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { feed };
