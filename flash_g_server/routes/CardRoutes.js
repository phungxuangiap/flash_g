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
const validationHandler = require("../middlewares/validationHandler");
const router = express.Router();
router.use(validationHandler);
router.route("/").get(getAllCards);
router
  .route("/:deskId")
  .put(updateChangedCards)
  .get(getAllCardsOfDesk)
  .post(createCard);
router.route("/:cardId").put(updateCard).delete(deleteCard);

module.exports = router;
