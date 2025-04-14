const express = require("express");
const profileRouter = require("./routes/profile");
const authRoute = require("./routes/auth");
const requestRouter = require("./routes/request.js");
const userRouter = require("./routes/user.js");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());
app.use(express.json());

//auth Routes
app.use("/", authRoute);

// all profile routes
app.use("/", profileRouter);

// all request routes
app.use("/", requestRouter);

// all user routes
app.use("/", userRouter);

module.exports = app;
