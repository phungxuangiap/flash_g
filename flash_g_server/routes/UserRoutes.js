const express = require("express");
const {
  registerUser,
  loginUser,
  refreshToken,
  logout,
  getCurrentUser,
  getUserById,
} = require("../controllers/UserController");
const validationHandler = require("../middlewares/validationHandler");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh").get(refreshToken);
router.route("/logout").post(logout);
router.use(validationHandler);
router.route("/current").get(getCurrentUser);
router.route("/:id").get(getUserById);

module.exports = router;
