import { Constants } from "./constants";
const jwt = require("jsonwebtoken");
const validationHandler = (err, req, res, next) => {
  let accessToken;
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startWith("Bearer")) {
    accessToken = authHeader.split(" ")[1];
    jwt.verify(accessToken, "ACCESS_TOKEN_SECRET", (error, decoded) => {
      if (error) {
        res.status(401);
        throw new Error("Unauthorized");
      } else {
        req.user = decoded.user;
        next();
      }
    });
  }
  if (!accessToken) {
    res.status(Constants.UNAUTHORIZED);
    throw new Error("User is unauthorize or access token is missing");
  }
};

module.exports = validationHandler;
