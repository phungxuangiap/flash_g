const express = require("express");
const {
  getAllCardsOfDesk,
  updateCard,
  deleteCard,
  createCard,
  updateChangedCards,
  getAllCards,
  createUpdateCard,
} = require("../controllers/CardController");
const { route } = require("./DeskRoutes");
const validationHandler = require("../middlewares/validationHandler");
const router = express.Router();
router.use(validationHandler);
router.route("/").get(getAllCards);
router.route("/:deskId").get(getAllCardsOfDesk).post(createCard);
router.route("/:cardId").put(updateCard).delete(deleteCard);

module.exports = router;
