const express = require("express");
const {
  getAllCards,
  updateCard,
  deleteCard,
  createCard,
  getCard,
} = require("../controllers/CardController");
const { route } = require("./DeskRoutes");
const router = express.Router();

router.route("/:deskId").get(getAllCards).post(createCard);
router.route("/:cardId").put(updateCard).delete(deleteCard);

module.exports = router;
