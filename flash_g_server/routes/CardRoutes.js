const express = require("express");
const {
  getAllCards,
  updateCard,
  deleteCard,
  createCard,
  updateChangedCards,
} = require("../controllers/CardController");
const { route } = require("./DeskRoutes");
const router = express.Router();

router
  .route("/:deskId")
  .put(updateChangedCards)
  .get(getAllCards)
  .post(createCard);
router.route("/:cardId").put(updateCard).delete(deleteCard);

module.exports = router;
