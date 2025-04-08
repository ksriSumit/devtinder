const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: [3, "firstName length should be at least 3 characters"],
      maxlength: [50, "firstName should not contain more than 50 characters"],
    },
    lastName: {
      type: String,
      required: true,
      minlength: [3, "lastName length should be at least 3 characters"],
      maxlength: [50, "lastName should not contain more than 50 characters"],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      validate: [validator.isEmail, "Invalid email"],
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (val) {
          return validator.isStrongPassword(val);
        },
        message:
          "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character",
      },
    },
    age: {
      type: Number,
      required: true,
      min: [18, "Underage cannot create a devTinder Profile"],
      max: [100, "Age cannot exceed 100"],
    },
    about: {
      type: String,
      default:
        "This is a default about. Kindly delete it and update it with your about",
    },
    skills: {
      type: [String],
    },
    gender: {
      type: String,
      validate: {
        validator: function (val) {
          return ["male", "female", "others"].includes(val);
        },
        message: "Provide valid gender data (male, female, or others)",
      },
    },
    photo: {
      type: String,
      validate: {
        validator: function (val) {
          return validator.isURL(val);
        },
        message: "Enter a valid URL",
      },
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: {
      createdAt: "created_on",
      updatedAt: "updated_on",
    }, // Enable automatic created_on and updated_on fields
  }
);

userSchema.methods.getJWT = async function () {
  const token = await jwt.sign(
    { _id: this._id, tokenVersion: this.tokenVersion },
    jwtSecret,
    {
      expiresIn: "1h",
    }
  );
  return token;
};

const UserModel = mongoose.model("Users", userSchema);

module.exports = UserModel;
