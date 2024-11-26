const asyncHandler = require("express-async-handler");
const { Constants } = require("../middlewares/constants");
const Card = require("../models/cardModel");
//@desc Get All Cards
//@route api/card/:deskId
//@access private
const getAllCards = asyncHandler(async (req, res, next) => {
  const allCards = await Card.find({ desk_id: req.params.deskId });
  if (allCards) {
    res.status(200).json(allCards);
  } else {
    res.status(Constants.NOT_FOUND);
    throw new Error("Not found");
  }
});

//@desc Create New Card
//@route api/card/:deskId
//@access private
const createCard = asyncHandler(async (req, res, next) => {
  const { vocab, description, sentence, vocab_audio, sentence_audio } =
    req.body;
  const newCard = await Card.create({
    desk_id: req.params.deskId,
    status: "NEW",
    level: 0,
    last_preview: "17:30",
    vocab,
    description,
    sentence,
    vocab_audio,
    sentence_audio,
  });
  res.status(200).json(newCard);
});
//@desc Update Card
//@route api/card/:cardId
//@access private
const updateCard = asyncHandler(async (req, res, next) => {
  const card = await Card.findById(req.params.cardId);
  if (card) {
    await Card.findByIdAndUpdate(req.params.cardId, req.body, { new: true });
    res.status(200).json(card);
  } else {
    res.status(Constants.NOT_FOUND);
    throw new Error("Not Found");
  }
});
//@desc Delete Card
//@route api/card/:cardId
//@access private
const deleteCard = asyncHandler(async (req, res, next) => {
  const card = await Card.findById(req.params.cardId);
  if (card) {
    await Card.findByIdAndDelete(req.params.cardId);
    res.status(200).json(card);
  } else {
    res.status(Constants.NOT_FOUND);
    throw new Error("Not Found");
  }
});
module.exports = { getAllCards, updateCard, deleteCard, createCard };
