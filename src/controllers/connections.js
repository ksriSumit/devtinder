const connectionRequestModel = require("../models/connectionRequestModel");
const connections = async (req, res) => {
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

    let data = await connectionRequestModel
      .find({
        $or: [
          { fromUserId: loggedInUser, status: "accepted" },
          { toUserId: loggedInUser, status: "accepted" },
        ],
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "skills",
        "about",
        "gender",
        "photoUrl",
        "age",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "skills",
        "about",
        "gender",
        "photoUrl",
        "age",
      ])
      .select("-__v -createdAt -updatedAt")
      .lean();
    data = data.map((val) => {
      if (val.fromUserId._id.toString() === loggedInUser._id.toString())
        return val.toUserId;
      else return val.fromUserId;
    });
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { connections };
