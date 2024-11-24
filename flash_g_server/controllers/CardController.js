const asyncHandler = require("express-async-handler");
//@desc Get All Cards
//@route api/card/:deskId
//@access private
const getAllCards = asyncHandler(async (req, res, next) => {
  res.json("Get All Card of DeskId");
});
//@desc Create New Card
//@route api/card/:deskId
//@access private
const createCard = asyncHandler(async (req, res, next) => {
  res.json("Create New Card of DeskId");
});
//@desc Update Card
//@route api/card/:cardId
//@access private
const updateCard = asyncHandler(async (req, res, next) => {
  res.json("Update card of cardId");
});
//@desc Delete Card
//@route api/card/:cardId
//@access private
const deleteCard = asyncHandler(async (req, res, next) => {
  res.json("Delete card of id");
});
module.exports = { getAllCards, updateCard, deleteCard, createCard };
