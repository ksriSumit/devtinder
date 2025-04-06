const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const handleValidationErrors = require("../middlewares/validators/handleValidationErrors");
const createRequestFilter = require("../middlewares/filters/requestFilter");

// Security middleware
router.use(helmet());
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, try again later",
});

// Controllers
const login = require("../controllers/login");
const createUser = require("../controllers/createAccount");
const logout = require("../controllers/logout");

// Validators
const { loginValidator } = require("../middlewares/validators/login/validator");
const {
  signupValidator,
} = require("../middlewares/validators/signup/validator");

// Filters
const loginFilter = createRequestFilter(
  ["email", "password"],
  ["email", "password"],
  { stripNulls: true, logRejected: true }
);

const signupFilter = createRequestFilter(
  [
    "firstName",
    "lastName",
    "email",
    "password",
    "age",
    "about",
    "skills",
    "gender",
    "photo",
  ],
  ["firstName", "lastName", "email", "password", "age"],
  { stripNulls: true, logRejected: true }
);

// Routes
router.post(
  "/login",
  authLimiter,
  loginFilter,
  loginValidator,
  handleValidationErrors,
  login
);
router.post(
  "/signup",
  authLimiter,
  signupFilter,
  signupValidator,
  handleValidationErrors,
  createUser
);
router.post("/logout", logout);

module.exports = router;
