const express = require("express");
const {
  registerUser,
  loginUser,
  refreshToken,
  logout,
} = require("../controllers/UserController");
const validationHandler = require("../middlewares/validationHandler");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh").get(refreshToken);
router.use(validationHandler);
router.route("/logout").post(logout);

module.exports = router;
