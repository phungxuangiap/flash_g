const asyncHandler = require("express-async-handler");

//@desc Login User
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
});
