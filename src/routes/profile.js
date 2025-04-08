const express = require("express");
const router = express.Router();

// ======================
// 1. Middleware Imports
// ======================
const { userAuth } = require("../middlewares/authenticate");
const handleValidationErrors = require("../middlewares/validators/handleValidationErrors");
const createRequestFilter = require("../middlewares/filters/requestFilter");
const {
  updateProfileValidator,
  changePasswordValidator,
} = require("../middlewares/validators/updateProfile/validator");

// ======================
// 2. Controller Imports
// ======================
const {
  viewProfile,
  updateUser,
  changePassword,
  // Other controllers (unused here but kept for completeness)
  getSingleUserByEmail,
  getAllUser,
  deleteUser,
} = require("../controllers/profile");

// ======================
// 3. Filter Definitions
// ======================
const updateProfileFilter = createRequestFilter(
  ["firstName", "lastName", "age", "gender", "skills", "about"],
  [], // No required fields
  { stripNulls: true, logRejected: true }
);
const changePasswordFilter = createRequestFilter(
  ["oldPassword", "newPassword"],
  ["oldPassword", "newPassword"],
  { stripNulls: true, logRejected: true }
);
// ======================
// 4. Route Definitions
// ======================

// View Profile (GET)
router.get("/profile/view", userAuth, viewProfile);

// Update Profile (PATCH)
router.patch(
  "/profile/edit",
  userAuth, // Authentication
  updateProfileFilter, // Whitelist allowed fields
  updateProfileValidator, // Validate input
  handleValidationErrors, // Handle validation errors
  updateUser // Controller
);

// Update Password (PATCH) - Placeholder for future implementation
router.patch(
  "/profile/change-password",
  userAuth, // Authentication
  changePasswordFilter, // Whitelist allowed fields
  changePasswordValidator, //Validate input
  handleValidationErrors, // Handle Validation errors
  changePassword // Controller
);

// ======================
// 5. Export Router
// ======================
module.exports = router;
