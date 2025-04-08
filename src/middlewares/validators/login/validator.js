const { body } = require("express-validator");
const userModel = require("../../../models/userModel");

module.exports = {
  loginValidator: [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Not a valid email address")
      .custom(async function (val) {
        const user = await userModel.findOne({ email: val });
        if (!user) throw new Error("Invalid Credentials");
        return true;
      }),
  ],
};
