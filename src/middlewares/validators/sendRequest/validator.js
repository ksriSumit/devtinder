const { param } = require("express-validator");
const UserModel = require("../../../models/userModel");
const sendRequestValidator = [
  param("status")
    .isString()
    .toLowerCase()
    .withMessage("Invalid Status")
    .isIn(["interested", "ignored"])
    .withMessage("Status can either be 'interested' or 'ignored'"),
  param("userId")
    .isMongoId()
    .withMessage("Invalid UserId")
    .custom(async function (val) {
      const user = await UserModel.findById(val).exec();
      if (!user) throw new Error("User not found");
      return true;
    }),
];
module.exports = { sendRequestValidator };
