const { body } = require("express-validator");
const UserModel = require("../../../models/userModel");

module.exports = {
  signupValidator: [
    // 1. firstName - Added .escape() for XSS protection
    body("firstName")
      .trim()
      .isString()
      .isLength({ min: 3, max: 50 })
      .matches(/^[a-zA-Z ]+$/)
      .escape() // ← Minimal add: sanitizes HTML
      .withMessage("First name: 3-50 letters only"),

    // 2. lastName - Identical to firstName for consistency
    body("lastName")
      .trim()
      .isString()
      .isLength({ min: 3, max: 50 })
      .matches(/^[a-zA-Z ]+$/)
      .escape()
      .withMessage("Last name: 3-50 letters only"),

    // 3. email - Kept identical (already solid)
    body("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Invalid email address")
      .custom(async function (val) {
        const user = await UserModel.findOne({ val });
        if (user) throw new Error("Email already in use");
        return true;
      }),

    // 4. password - Explicitly defined strong criteria
    body("password")
      .isString()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password: 8+ chars with 1 uppercase, number, and symbol"),

    // 5. age - Kept identical (perfect as-is)
    body("age")
      .toInt()
      .isInt({ min: 18, max: 100 })
      .withMessage("Age must be 18-100"),

    // 6. about - Added max length
    body("about")
      .optional()
      .trim()
      .isString()
      .isLength({ max: 500 }) // ← Minimal add: prevents DB bloat
      .withMessage("About: Max 500 characters"),

    // 7. skills - Added item length check
    body("skills")
      .optional()
      .isArray()
      .custom(
        (val) =>
          Array.isArray(val) &&
          val.every((item) => typeof item === "string" && item.length <= 30)
      ) // ← 30-char limit per skill
      .withMessage("Skills: Each must be a string (max 30 chars)"),

    // 8. gender - Switched to .isIn() for clarity
    body("gender")
      .optional()
      .isString()
      .isIn(["male", "female", "others"]) // ← More readable than .custom()
      .withMessage("Gender: Must be male/female/others"),

    // 9. photo - Enforced HTTPS
    body("photo")
      .optional()
      .isURL({ protocols: ["https"] }) // ← Blocks HTTP URLs
      .withMessage("Photo: Must be a valid HTTPS URL"),
  ],
};
