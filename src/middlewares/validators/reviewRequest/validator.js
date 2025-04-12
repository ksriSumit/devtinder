const { param } = require("express-validator");
const connectionRequestModel = require("../../../models/connectionRequestModel");

const reviewRequestValidator = [
  param("status")
    .isString()
    .withMessage("Invalid status type") // More specific message
    .toLowerCase() // Convert to lowercase before checking
    .isIn(["accepted", "rejected"]) // Your allowed values
    .withMessage("Status can be either 'accepted' or 'rejected'"), // Fixed message to match values

  param("requestId")
    .isMongoId()
    .withMessage("Invalid request ID format") // More specific
    .bail() // Stop if ID format is invalid
    .custom(async (val) => {
      // Use arrow function for consistency
      const request = await connectionRequestModel.findById(val).exec(); // Add .exec()
      if (!request) throw new Error("Connection request not found"); // More descriptive
      return true;
    }),
];

module.exports = { reviewRequestValidator };
