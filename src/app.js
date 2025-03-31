const express = require("express");
const app = express();

const connectDB = require("./config/database");
const UserModel = require("./models/userModel");
const { SchemaTypeOptions } = require("mongoose");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello From Backend");
});

app.post("/signup", async (req, res, next) => {
  console.log(req.body);
  const user = new UserModel(req.body);

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
});

// Get user by EmailID - /user
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await UserModel.find({ email: userEmail });
    if (!user) {
      res.status(404).send("User not found");
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send("Something Went Wrong");
  }
});

//Get all users - /feed
app.get("/feed", async (req, res) => {
  const users = await UserModel.find({});
  if (!users) {
    res.status(500).send("Database is empty");
  }
  res.status(200).send(users);
});

// Delete User API -- /user
app.delete("/user", async (req, res) => {
  const userEmail = req.body.email;
  // console.log(userEmail);
  try {
    const user = await UserModel.findOne({ email: userEmail });

    if (!user)
      return res
        .status(404)
        .send("User does not exist with email: " + userEmail);

    const deleteStatus = await UserModel.findByIdAndDelete({
      _id: user._id,
    });

    if (deleteStatus && deleteStatus._id.toString() === user._id.toString()) {
      return res
        .status(200)
        .send("Deleted Successfully: " + deleteStatus.email);
    }

    res.status(400).send("Something Went Wrong");
  } catch (error) {
    res.status(500).send("Something Went Wrong");
  }
});

//Update User API -- /user
app.patch("/user", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user)
      return res
        .status(404)
        .send("User does not exist with email: " + req.body.email);

    const updateStatus = await UserModel.findByIdAndUpdate(
      {
        _id: user._id,
      },
      { email: req.body.newEmail },
      { returnDocument: "after" }
    );

    if (updateStatus && updateStatus._id.toString() === user._id.toString()) {
      return res
        .status(200)
        .send("Email Address Updated to: " + updateStatus.email);
    }

    res.status(400).send("Something Went Wrong");
  } catch (error) {
    res.status(500).send("Something Went Wrong");
  }
});

//Start the DB first, then only start the application
connectDB()
  .then(() => {
    console.log("Connection is Established to Database");
    app.listen(3000, () => {
      console.log("App listening on port 3000!");
    });
  })
  .catch((error) => {
    console.error("Error Occurred:\n", error.message);
  });
