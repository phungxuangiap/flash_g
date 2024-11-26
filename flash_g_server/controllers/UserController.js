const asyncHandler = require("express-async-handler");
const { Constants } = require("../middlewares/constants");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//@desc Login User
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  let token;
  if (!email || !password) {
    res.status(Constants.VALIDATION_ERROR);
    throw new Error("All fields are mandatory!");
  } else {
    const availableUser = await User.findOne({ email });
    if (
      availableUser &&
      (await bcrypt.compare(password, availableUser.password))
    ) {
      token = jwt.sign({ user: availableUser }, "ACCESS_TOKEN_SECRET", {
        expiresIn: "15m",
      });
      res.status(200).json({ access_token: token });
    } else {
      res.status(Constants.VALIDATION_ERROR);
      throw new Error("Email or Password are invalid!");
    }
  }
});

//@desc Register User
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res, next) => {
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
      res.status(200).json(newUser);
    }
  }
});

module.exports = { loginUser, registerUser };
