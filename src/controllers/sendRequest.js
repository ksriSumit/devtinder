const connectionRequestModel = require("../models/connectionRequestModel");
const sendRequest = async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.userId;
    const status = req.params.status;
    const existingRequest = await connectionRequestModel.findOne({
      $or: [
        {
          fromUserId,
          toUserId,
        },
        { fromUserId: toUserId, toUseId: fromUserId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        status: false,
        message: "Request already exists",
      });
    }

    const request = new connectionRequestModel({
      fromUserId,
      toUserId,
      status,
    });
    await request.save();
    res.status(201).json({
      status: true,
      message: "Request Sent Successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = { sendRequest };
