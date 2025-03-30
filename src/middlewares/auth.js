const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";
  if (isAdminAuthorized) {
    console.log("Admin is Getting Authenticated");
    next();
  } else {
    res.status(401).send("User Not Authorized");
  }
};

const userAuth = (req, res, next) => {
  const token = "xyz";
  const isUserAuthorized = token === "xyz";
  if (isUserAuthorized) {
    console.log("User is Getting Authenticated");
    next();
  } else {
    res.status(401).send("User Not Authorized");
  }
};

module.exports = { adminAuth, userAuth };
