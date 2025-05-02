const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const saltRounds = 12;
const createUser = async (req, res, next) => {
  const { firstName, lastName, email, password, age, gender, skills } =
    req.body;

  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new UserModel({
    firstName,
    lastName,
    email,
    password: passwordHash,
    age,
    gender,
    skills,
  });

  try {
    const savedUser = await user.save();

    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, //1 day
    });

    const userWithoutSensitiveFields = user.toObject();
    delete userWithoutSensitiveFields.password;
    delete userWithoutSensitiveFields.__v;
    delete userWithoutSensitiveFields.tokenVersion;
    delete userWithoutSensitiveFields.created_on;
    delete userWithoutSensitiveFields.updated_on;

    return res.status(201).json({
      success: true,
      data: userWithoutSensitiveFields,
    });
  } catch (error) {
    console.log("Something went wrong", error);
    res.status(500).send("Something Went Wrong");
  }
};

module.exports = createUser;
