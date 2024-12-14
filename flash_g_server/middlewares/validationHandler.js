const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { Constants } = require("../middlewares/constants");
const { generateAccessToken } = require("../helper");

const validationHandler = asyncHandler(async (req, res, next) => {
  let accessToken;
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    accessToken = authHeader.split(" ")[1];
    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      (error, decoded) => {
        if (error) {
          res.status(Constants.UNAUTHORIZED);
          throw new Error("Unauthorized");
        } else {
          req.user = decoded;
          console.log("[USER]", req.user);
          console.log("[DECODED]", decoded);
          next();
        }
      }
    );
  }
  if (!accessToken) {
    res.status(Constants.UNAUTHORIZED);
    throw new Error("User is unauthorized or access token is missing");
  }
});

module.exports = validationHandler;
