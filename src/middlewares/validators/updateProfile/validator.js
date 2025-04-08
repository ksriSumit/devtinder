const { body } = require("express-validator");
const UserModel = require("../../../models/userModel");
const bcrypt = require("bcrypt");
module.exports = {
  updateProfileValidator: [
    body("firstName")
      .optional()
      .trim()
      .isString()
      .isLength({ min: 2, max: 50 })
      .withMessage("First name must be 2-50 characters"),

    body("lastName")
      .optional()
      .trim()
      .isString()
      .isLength({ min: 2, max: 50 })
      .withMessage("Last name must be 2-50 characters"),

    body("age")
      .optional()
      .isInt({ min: 18, max: 60 })
      .withMessage("Age must be between 18 and 60"),

    body("gender")
      .optional()
      .trim()
      .toLowerCase()
      .isIn(["male", "female", "others"])
      .withMessage("Gender must be male, female, or others"),

    body("skills")
      .optional()
      .isArray()
      .withMessage("Skills must be an array of strings"),

    body("about")
      .optional()
      .trim()
      .escape() // Sanitize HTML
      .isLength({ min: 1, max: 500 })
      .withMessage("About must be 1-500 characters"),
  ],
  changePasswordValidator: [
    // Validate oldPassword (check if matches current password)
    body("oldPassword")
      .notEmpty()
      .withMessage("Old password is required")
      .custom(async (val, { req }) => {
        const user = await UserModel.findById(req.user._id).select("+password");
        if (!user) throw new Error("User not found");

        const isMatch = await bcrypt.compare(val, user.password);
        if (!isMatch) throw new Error("Current password is incorrect");
        return true;
      }),

    // Validate newPassword (strength, confirmation, etc)
    // Explicitly defined strong criteria
    body("newPassword")
      .notEmpty()
      .isString()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password: min 8 chars with 1 uppercase, number, and symbol"
      ),
  ],
};
