const express = require("express");
const router = express.Router();
const {
  validateEmail,
  validateEmailForUpdate,
} = require("../middlewares/validators/user/validator");
const handleValidationErrors = require("../middlewares/validators/handleValidationErrors");
const {
  getSingleUserByEmail,
  getAllUser,
  deleteUser,
  updateUser,
} = require("../controllers/user");
const { userAuth } = require("../middlewares/authenticate");
// Get user by EmailID - /user
router.get(
  "/user",
  userAuth,
  validateEmail,
  handleValidationErrors,
  getSingleUserByEmail
);

//Get all users - /feed
router.get("/user/all", userAuth, getAllUser);

// Delete User API -- /user
router.delete(
  "/user",
  userAuth,
  validateEmail,
  handleValidationErrors,
  deleteUser
);

//Update User API -- /user
router.patch(
  "/user",
  userAuth,
  validateEmailForUpdate,
  handleValidationErrors,
  updateUser
);

module.exports = router;
