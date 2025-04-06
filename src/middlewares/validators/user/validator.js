const { body } = require("express-validator");
const UserModel = require("../../../models/userModel");

module.exports = {
  validateEmail: [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Invalid Email")
      .custom(async function (val) {
        const user = await UserModel.findOne({ email: val }); // ✅ Corrected query
        if (!user) throw new Error("User does not exist");
        return true;
      }),
  ],

  validateEmailForUpdate: [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Invalid Email")
      .custom(async function (val) {
        const user = await UserModel.findOne({ email: val }); // ✅ Corrected query
        if (!user) throw new Error("User does not exist");
        return true;
      }),

    body("newEmail")
      .trim()
      .isEmail()
      .withMessage("Invalid Email")
      .custom(async function (val) {
        const user = await UserModel.findOne({ email: val }); // ✅ Corrected query
        if (user) throw new Error("User with new email address already exists");
        return true;
      }),
  ],
};
