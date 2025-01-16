const asyncHandler = require("express-async-handler");
const { Constants } = require("../middlewares/constants");
const Card = require("../models/cardModel");
const { DistanceFromDateToDate } = require("../helper");
const { v4: uuidv4 } = require("uuid");
const { getAllDesks } = require("./DeskController");
//@desc Get All Cards
//@route api/card/:deskId
//@access private
const getAllCardsOfDesk = asyncHandler(async (req, res, next) => {
  const allCards = await Card.find({ desk_id: req.params.deskId });
  if (allCards) {
    if (req.query.current) {
      //get current date
      utcDate = new Date();
      const vietnamTime = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
      let currentCards = allCards.filter((item) => {
        // get last preview and convert it to vietnam time
        const lastPreview = Date.parse(item.last_preview);
        const lastPreviewDate = new Date(lastPreview);
        const lastPreviewVietNamDate = new Date(
          lastPreviewDate.getTime() + 7 * 60 * 60 * 1000
        );
        // return only cards need to preview (match expired time)
        return (
          Math.pow(2, item.level) <=
          DistanceFromDateToDate(
            lastPreviewVietNamDate.getDate(),
            lastPreviewVietNamDate.getMonth(),
            lastPreviewVietNamDate.getFullYear(),
            vietnamTime.getDate(),
            vietnamTime.getMonth(),
            vietnamTime.getFullYear()
          )
        );
      });
      res.json(currentCards);
    } else {
      res.status(200).json(allCards);
    }
  } else {
    res.status(Constants.NOT_FOUND);
    throw new Error("Not found");
  }
});

//@desc Get All Cards
//@route api/card/
//@access private
const getAllCards = asyncHandler(async (req, res, next) => {
  const allCards = await Card.find({ user_id: req.user._id });
  res.json(allCards);
});

//@desc Update Changed Cards
//@route api/card/:deskId
//@access private
// const updateChangedCards = asyncHandler(async (req, res, next) => {
//   const listCardsUpdated = req.body?.cards_changed;
//   if (!listCardsUpdated) {
//     res.status(200).json({ message: "Nothing need to update" });
//   } else {
//     await listCardsUpdated.forEach(async (item) => {
//       const cardChanged = await Card.findByIdAndUpdate(
//         item._id,
//         { ...item, modified_time: JSON.stringify(new Date()).slice(1, -1) },
//         {
//           new: true,
//         }
//       );
//       console.log("[Card]", cardChanged);
//     });
//     res.status(200).json({ message: "All changes are updated" });
//   }
// });

//@desc Create New Card
//@route api/card/:deskId
//@access private
const createCard = asyncHandler(async (req, res, next) => {
  const { vocab, description, sentence, vocab_audio, sentence_audio } =
    req.body;
  const newCard = await Card.create({
    _id: uuidv4(),
    desk_id: req.params.deskId,
    user_id: req.user._id,
    status: "new",
    level: 0,
    last_preview: JSON.stringify(new Date()).slice(1, -1),
    vocab,
    description,
    sentence,
    vocab_audio,
    sentence_audio,
    modified_time: JSON.stringify(new Date()).slice(1, -1),
  });
  res.status(200).json(newCard);
});
//@desc Update Card
//@route api/card/:cardId
//@access private
const updateCard = asyncHandler(async (req, res, next) => {
  console.log(req.params.cardId);
  const card = await Card.findById(req.params.cardId)
    .then((res) => {
      console.log("[RES]", res);
      return res;
    })
    .catch((err) => {
      console.log("[ERR]", err);
      return null;
    });
  if (card) {
    await Card.findByIdAndUpdate(
      req.params.cardId,
      { ...req.body },
      { new: true }
    );
    res.status(200).json(card);
  } else {
    console.log("Here");
    const newCard = Card.collection.insertOne({
      ...req.body,
    });
    if (newCard) {
      res.status(200).json(newCard);
    } else {
      res.status(Constants.FORBIDDEN);
      throw new Error("Forbiddant !");
    }
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

//@desc Create Card, if exist Update
//@route PUT api/card/:deskId/:cardId
//@access private
// const createUpdateCard = asyncHandler(async (req, res, next) => {
//   const card = await Card.findById(req.params.cardId);
//   if (card) {
//     await Card.findByIdAndUpdate(
//       req.params.cardId,
//       {
//         status: req.body.status,
//         level: req.body.level,
//         last_preview: JSON.stringify(new Date()).slice(1, -1),
//         vocab: req.body.vocab,
//         description: req.body.description,
//         sentence: req.body.sentence,
//         vocab_audio: req.body.vocab_audio,
//         sentence_audio: req.body.sentence_audio,
//         modified_time: JSON.stringify(new Date()).slice(1, -1),
//       },
//       { new: true }
//     );
//     res.status(200).json({ status: "Update", data: card });
//   } else {
//     const newCard = Card.create({
//       ...req.body,
//       last_preview: JSON.stringify(new Date()).slice(1, -1),
//       modified_time: JSON.stringify(new Date()).slice(1, -1),
//     });
//     if (newCard) {
//       res.status(200).json({
//         status: "Create New Card Successfully",
//         data: newCard,
//       });
//     }
//   }
// });

module.exports = {
  getAllCardsOfDesk,
  updateCard,
  deleteCard,
  createCard,
  getAllCards,
};
