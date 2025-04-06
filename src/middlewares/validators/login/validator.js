const { body } = require("express-validator");
const userModel = require("../../../models/userModel");

module.exports = {
  loginValidator: [
    body("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Not a valid email address")
      .custom(async function (val) {
        const user = await userModel.findOne({ email: val }); // ✅ Corrected query
        if (!user) throw new Error("Invalid Credentials");
        return true;
      }),
  ],
};
