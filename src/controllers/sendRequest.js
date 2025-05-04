const connectionRequestModel = require("../models/connectionRequestModel");
const UserModel = require("../models/userModel");
const { run } = require("../utils/ses_sendemail");

const sendRequest = async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.userId;
    const status = req.params.status;

    const existingRequest = await connectionRequestModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }, // Fixed typo (toUseId → toUserId)
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

    // Fetch sender details (fixed select() syntax & findById parameter)
    const fromUser = await UserModel.findById(fromUserId).select(
      "email firstName lastName"
    );
    const toUser = await UserModel.findById(toUserId).select("email");

    // Send email (added body and await)
    const subject = `${fromUser.firstName} ${fromUser.lastName} Sent You a Connection Request`;
    const body = `Hi, ${fromUser.firstName} ${fromUser.lastName} wants to connect with you on HappyDevs platform!`;

    await run(fromUser.email, toUser.email, subject, body); // Added body
    // const resEmail = await run(
    //   "ksrisumit@gmail.com",
    //   "notification@happydevs.pw",
    //   subject,
    //   body
    // ); // Added body

    console.log(resEmail);

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
