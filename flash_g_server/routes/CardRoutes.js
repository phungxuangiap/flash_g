const express = require("express");
const {
  getAllCardsOfDesk,
  updateCard,
  deleteCard,
  createCard,
  updateChangedCards,
  getAllCards,
} = require("../controllers/CardController");
const { route } = require("./DeskRoutes");
const router = express.Router();
router.route("/").get(getAllCards);
router
  .route("/:deskId")
  .put(updateChangedCards)
  .get(getAllCardsOfDesk)
  .post(createCard);
router.route("/:cardId").put(updateCard).delete(deleteCard);

module.exports = router;
