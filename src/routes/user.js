const express = require("express");
const { userAuth } = require("../middlewares/authenticate");
const {
  receivedConnectionRequest,
} = require("../controllers/receivedConnectionRequest");

const { feed } = require("../controllers/feed");
const { connections } = require("../controllers/connections");

const router = express.Router();

// GET the connections which user have received
router.get(
  "/user/received/connectionRequests",
  userAuth,
  receivedConnectionRequest
);

// GET the profile of users to which loggedIn user have not sent or received request
router.get("/user/feed", userAuth, feed);

// GET the connections to which loggedIn user is connected with
router.get("/user/connections", userAuth, connections);

module.exports = router;
