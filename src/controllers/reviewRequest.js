const ConnectionRequestModel = require("../models/connectionRequestModel");

const reviewRequest = async (req, res) => {
  try {
    const { requestId, status } = req.params;
    const userId = req.user._id; // Assuming you have user auth middleware

    // 1. Find the request and verify it exists and belongs to the user
    const request = await ConnectionRequestModel.findOne({
      _id: requestId,
      toUserId: userId, // Ensure the request belongs to the current user
    });

    if (!request) {
      return res.status(404).json({
        status: false,
        message: "Request not found or unauthorized",
      });
    }

    // 2. Validate current status is "interested"
    if (request.status !== "interested") {
      return res.status(400).json({
        status: false,
        message: "Request must be in 'interested' status to update",
      });
    }

    // 3. Validate new status is either "accepted" or "rejected"?
    // (You might want to add this validation - not in your original code)
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        status: false,
        message: "Status can only be updated to 'accepted' or 'rejected'",
      });
    }

    // 4. Update the request
    const updatedRequest = await ConnectionRequestModel.findByIdAndUpdate(
      requestId,
      { status },
      { new: true } // Return the updated document
    );

    res.status(200).json({
      status: true,
      message: `Connection Request ${status}`,
      data: updatedRequest,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = { reviewRequest };
