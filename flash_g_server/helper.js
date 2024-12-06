const jwt = require("jsonwebtoken");
// Generate access token
// exprired time 15s
const generateAccessToken = (user) => {
  let token;
  if (user) {
    token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15s",
    });
  }
  return token ? token : undefined;
};

// Generate refresh token
// expired time infinity
const generateRefreshToken = (user) => {
  let token;
  if (user) {
    token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  }
  return token ? token : undefined;
};

module.exports = { generateAccessToken, generateRefreshToken };
