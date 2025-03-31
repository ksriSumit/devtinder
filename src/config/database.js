const mongoose = require("mongoose");

const connectDB = async () => {
  return await mongoose.connect(
    "mongodb+srv://ksrisumit:4jH27viSjjZ8ab86@sumitbackend.v5zme.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
