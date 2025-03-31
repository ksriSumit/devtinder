const express = require("express");
const app = express();

const connectDB = require("./config/database");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello From Backend");
});

app.use("/", (req, res, next) => {
  console.log("Working till here");
  next();
});

app.post("/signup", (req, res, next) => {
  console.log(req.params);
  res.status(201).send("User Created Successfully");
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
