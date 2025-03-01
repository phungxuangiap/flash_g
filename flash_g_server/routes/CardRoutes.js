const express = require("express");
const {
  getAllCardsOfDesk,
  updateCard,
  deleteCard,
  createCard,
  updateChangedCards,
  getAllCards,
  createUpdateCard,
  cloneCard,
  createMultipleCards,
} = require("../controllers/CardController");
const { route } = require("./DeskRoutes");
const router = express.Router();
router.route("/:deskId").get(getAllCardsOfDesk);
const validationHandler = require("../middlewares/validationHandler");
router.use(validationHandler);
router.route("/").get(getAllCards);
router.route("/:deskId").get(getAllCardsOfDesk).post(createCard);
router.route("/:cardId").put(updateCard).delete(deleteCard);
router.route("/multiple/:deskId").post(createMultipleCards);

module.exports = router;
