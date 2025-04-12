const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/authenticate");
const { reviewRequest } = require("../controllers/reviewRequest");
const { sendRequest } = require("../controllers/sendRequest");
const handleValidationErrors = require("../middlewares/validators/handleValidationErrors");
const {
  reviewRequestValidator,
} = require("../middlewares/validators/reviewRequest/validator");
const {
  sendRequestValidator,
} = require("../middlewares/validators/sendRequest/validator");

// Send connection request route
router.post(
  "/requests/:userId/:status", // More RESTful ordering (resource before action)
  userAuth,
  sendRequestValidator,
  handleValidationErrors,
  sendRequest
);

// Review connection request route
router.patch(
  // Changed to PATCH since we're modifying an existing resource
  "/requests/:requestId/:status",
  userAuth,
  reviewRequestValidator,
  handleValidationErrors,
  reviewRequest
);

module.exports = router;
