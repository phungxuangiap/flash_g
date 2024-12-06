const express = require("express");
const {
  registerUser,
  loginUser,
  refreshToken,
} = require("../controllers/UserController");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh").get(refreshToken);

module.exports = router;
