const mongoose = require("mongoose");
const UserModel = require("./userModel");
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: UserModel,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: UserModel,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.pre("save", function (next) {
  if (this.fromUserId.equals(this.toUserId))
    throw new Error("Cannot Send request to self");
  next();
});

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequests",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
