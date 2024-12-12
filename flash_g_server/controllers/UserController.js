const asyncHandler = require("express-async-handler");
const { Constants } = require("../middlewares/constants");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../helper");
//@desc Login User
//@route POST /api/user/login
//@access public
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  let access_token;
  if (!email || !password) {
    res.status(Constants.VALIDATION_ERROR);
    throw new Error("All fields are mandatory!");
  } else {
    const availableUser = await User.findOne({ email });
    if (
      availableUser &&
      (await bcrypt.compare(password, availableUser.password))
    ) {
      access_token = jwt.sign(
        { user: availableUser },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "15m",
        }
      );
      access_token = generateAccessToken({
        user_name: availableUser.user_name,
        password: availableUser.password,
        email: availableUser.email,
      });
      refresh_token = generateRefreshToken({
        user_name: availableUser.user_name,
        password: availableUser.password,
        email: availableUser.email,
      });
      res.cookie(process.env.REFRESH_TOKEN_COOKIE, refresh_token, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
      });
      res.status(200).json({ access_token });
    } else {
      res.status(Constants.VALIDATION_ERROR);
      throw new Error("Email or Password are invalid!");
    }
  }
});

//@desc Register User
//@route POST /api/user/register
//@access public
const registerUser = asyncHandler(async (req, res, next) => {
  let access_token;
  let refresh_token;
  const { email, password, user_name } = req.body;
  if (!email || !password || !user_name) {
    res.status(Constants.VALIDATION_ERROR);
    throw new Error("All fields are mandatory!");
  } else {
    const availableUser = await User.findOne({ email });
    if (availableUser) {
      res.status(Constants.VALIDATION_ERROR);
      throw new Error("Email is already used!");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        email,
        password: hashedPassword,
        user_name,
      });
      access_token = generateAccessToken({ user_name, password, email });
      refresh_token = generateRefreshToken({ user_name, password, email });
      res.cookie(process.env.REFRESH_TOKEN_COOKIE, refresh_token, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
      });
      res.status(200).json({ access_token });
    }
  }
});

//@desc Refresh Access Token
//@route api/user/refresh
//@access public
const refreshToken = (req, res, next) => {
  const cookies = req.cookies;
  let refresh_token;
  let access_token;
  if (cookies && cookies[process.env.REFRESH_TOKEN_COOKIE]) {
    refresh_token = cookies[process.env.REFRESH_TOKEN_COOKIE];
  }
  console.log("[REFRESH_TOKEN]", refresh_token);
  jwt.verify(
    refresh_token,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        res.status(Constants.UNAUTHORIZED);
        throw new Error("Unauthorized !");
      } else {
        access_token = generateAccessToken({
          user_name: decoded.user_name,
          email: decoded.email,
          password: decoded.password,
        });
        res.status(200).json({ access_token });
      }
    }
  );
  if (!access_token) {
    console.log("error outside verify token");
    res.status(Constants.UNAUTHORIZED);
    throw new Error("Unauthorized !");
  }
};

//@desc Logout
//@route /api/user/logout
//@access private
const logout = async (req, res, next) => {
  await res.clearCookie(process.env.REFRESH_TOKEN_COOKIE);
  await res.status(200).json({ title: "Logout successfully!" });
};

module.exports = { loginUser, registerUser, refreshToken, logout };
