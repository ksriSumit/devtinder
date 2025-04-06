const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const saltRounds = 12;
const createUser = async (req, res, next) => {
  const { firstName, lastName, email, password, age, gender, skill } = req.body;

  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new UserModel({
    firstName,
    lastName,
    email,
    password: passwordHash,
    age,
    gender,
    skill,
  });

  await user
    .save()
    .then(() => {
      console.log("Data Saved Successfully");
      res
        .status(201)
        .send(
          "User Created Successfully with FirstName: " + req.body.firstName
        );
    })
    .catch((error) => {
      console.log("Something went wrong", error);
      res.status(500).send("Something Went Wrong");
    });
};

module.exports = createUser;
