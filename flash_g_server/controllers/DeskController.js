const asyncHandler = require("express-async-handler");

//@desc Get All Desks
//@route GET /api/desk/
//@access private
const getAllDesks = asyncHandler(async (req, res, next) => {
  // res.json("Get all desks");
  res.status(403);
  throw new Error("Not Found");
});

//@desc Delete Desk
//@route GET /api/desk/:id
//@access private
const deleteDesk = asyncHandler(async (req, res, next) => {
  res.json("Delete Desk");
});

//@desc Delete All Desks
//@route DELETE /api/desk/:id
//@access private
const deleteAllDesks = asyncHandler(async (req, res, next) => {
  res.json("Delete All Desk");
});

//@desc Create New Desk
//@route POST /api/desk/
//@access private
const createNewDesk = asyncHandler(async (req, res, next) => {
  res.json("Create new Desk");
});
//@desc Update Desk
//@route GET /api/desk/:id
//@access private
const updateDesk = (req, res, next) => {
  res.json("Update Desk");
};
module.exports = {
  getAllDesks,
  deleteDesk,
  deleteAllDesks,
  updateDesk,
  createNewDesk,
};
