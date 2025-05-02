const express = require("express");
const profileRouter = require("./routes/profile");
const authRoute = require("./routes/auth");
const requestRouter = require("./routes/request.js");
const userRouter = require("./routes/user.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

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
