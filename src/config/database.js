const mongoose = require("mongoose");
require("dotenv").config();

const dbString = process.env.DB_CONNECTION_STRING;

const connectDB = async () => {
  return await mongoose.connect(dbString);
};

module.exports = connectDB;
