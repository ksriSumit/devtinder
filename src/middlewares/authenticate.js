const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Authorization token missing",
      });
    }
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    //putting the next method here because if placed at last
    // The route handler would still execute even after failed authentication
    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token expired",
      });
    }

    return res.status(401).json({
      success: false,
      error: "Authentication failed",
    });
  }
};

module.exports = { userAuth };
