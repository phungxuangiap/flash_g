const asyncHandler = require("express-async-handler");
const { Constants } = require("../middlewares/constants");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
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
      console.log("{user}", availableUser);
      access_token = generateAccessToken({
        _id: availableUser._id,
        user_name: availableUser.user_name,
        full_name: availableUser.full_name,
        email: availableUser.email,
        password: availableUser.password,
      });
      refresh_token = generateRefreshToken({
        _id: availableUser._id,
        user_name: availableUser.user_name,
        email: availableUser.email,
        full_name: availableUser.full_name,

        password: availableUser.password,
      });
      res.cookie(process.env.REFRESH_TOKEN_COOKIE, refresh_token, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 315360000,
      });
      res.status(200).json({ access_token });
    } else {
      res.status(Constants.VALIDATION_ERROR);
      throw new Error("Email or Password are invalid!");
    }
  }
});

//@desc Get current User
//@route GET /api/user/current
//@route private
const getCurrentUser = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || req.headers.Authorization;
  let accessToken;
  if (header) {
    accessToken = header.split(" ")[1];
  }
  if (accessToken) {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(Constants.NOT_FOUND);
        throw new Error("Unauthorized !");
      } else {
        res.status(200).json({
          _id: decoded._id,
          user_name: decoded.user_name,
          full_name: decoded.full_name,
          email: decoded.email,
          password: decoded.password,
        });
      }
    });
  } else {
    res.status(Constants.NOT_FOUND);
    throw new Error("Missing access token");
  }
});

//@desc Register User
//@route POST /api/user/register
//@access public
const registerUser = asyncHandler(async (req, res, next) => {
  let access_token;
  let refresh_token;
  const { email, password, user_name, full_name } = req.body;
  if (!email || !password || !user_name || !full_name) {
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
        _id: uuidv4(),
        email,
        password: hashedPassword,
        user_name,
        full_name,
        modified_time: JSON.stringify(new Date()).slice(1, -1),
      });
      access_token = generateAccessToken({
        _id: newUser._id,
        user_name: newUser.user_name,
        email: newUser.email,
        full_name: newUser.full_name,
        password: newUser.password,
      });
      refresh_token = generateRefreshToken({
        _id: newUser._id,
        user_name: newUser.user_name,
        email: newUser.email,
        full_name: newUser.full_name,
        password: newUser.password,
      });
      res.cookie(process.env.REFRESH_TOKEN_COOKIE, refresh_token, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 315360000,
      });
      console.log(newUser);
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
  jwt.verify(
    refresh_token,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        res.status(Constants.UNAUTHORIZED);
        throw new Error("Unauthorized !");
      } else {
        access_token = generateAccessToken({
          _id: decoded._id,
          user_name: decoded.user_name,
          full_name: decoded.full_name,
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

//@desk get user by id
//@route /api/user/:id
//@access private
const getUserById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (id) {
    const user = await User.findOne({ _id: id })
      .then((respone) => {
        res.status(200).json({
          _id: respone._id,
          full_name: respone.full_name,
          email: respone.email,
          user_name: respone.user_name,
        });
      })
      .catch((err) => {
        console.log("Get user by id error with message:", err);
      });
  }
});

module.exports = {
  loginUser,
  registerUser,
  refreshToken,
  logout,
  getCurrentUser,
  getUserById,
};
