const express = require("express");
const userRouter = require("./routes/profile");
const authRoute = require("./routes/auth");
const requestRouter = require("./routes/request.js");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());
app.use(express.json());

//auth Routes
app.use("/", authRoute);

// all user routes
app.use("/", userRouter);

// all request routes
app.use("/", requestRouter);

module.exports = app;
