const express = require("express");
const {
  getAllCards,
  updateCard,
  deleteCard,
  createCard,
} = require("../controllers/CardController");
const { route } = require("./DeskRoutes");
const router = express.Router();

router.route("/card").get(getAllCards).post(createCard);
router.route("/card/:cardId").put(updateCard).delete(deleteCard);

module.exports = router;
