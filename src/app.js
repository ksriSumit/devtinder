const express = require("express");
const userRouter = require("./routes/user");
const authRoute = require("./routes/auth");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());
app.use(express.json());

//auth Routes
app.use("/", authRoute);

// all user routes
app.use("/", userRouter);

module.exports = app;
