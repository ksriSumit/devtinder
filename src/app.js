const express = require("express");
const app = express();

const { userAuth, adminAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);

app.post("/user/login", (req, res) => {
  res.send("User Logged In successfully");
});

app.get("/user/data", userAuth, (req, res) => {
  res.send("User Data Send Successfully");
});

app.get("/admin/getAllData", (req, res) => {
  res.send("All Data Sent Successfully");
});

app.listen(3000, () => {
  console.log("App listening on port 3000!");
});
