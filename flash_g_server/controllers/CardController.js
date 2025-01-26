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
//@route POST api/card/:deskId
//@access private
const createCard = asyncHandler(async (req, res, next) => {
  const { vocab, description, sentence, vocab_audio, sentence_audio } =
    req.body;
  const card_id = uuidv4();
  const action = req.query.action;

  if (!action) {
    const newCard = await Card.create({
      _id: card_id,
      desk_id: req.params.deskId,
      original_id: card_id,
      author_id: req.user._id,
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
  } else {
    next();
  }
});
//@desc Clone Card
//@route POST api/card/:deskId?action=clone
//@access private
const cloneCard = asyncHandler(async (req, res, next) => {
  const cloneCardDeskId = req.params.deskId;
  const action = req.query.action;
  console.log(action, "ACTIOn");

  if (cloneCardDeskId && action === "clone") {
    const cloneCards = await Card.find({ desk_id: cloneCardDeskId });
    await Promise.all(
      cloneCards.map((card) => {
        return Card.create({
          _id: uuidv4(),
          desk_id: cloneCardDeskId,
          author_id: card.author_id,
          original_id: card._id,
          user_id: req.user._id,
          status: "NEW",
          level: 0,
          last_preview: JSON.stringify(new Date()).slice(1, -1),
          vocab: card.vocab,
          description: card.description,
          sentence: card.sentence,
          vocab_audio: card.vocab_audio,
          sentence_audio: card.sentence_audio,
          modified_time: JSON.stringify(new Date()).slice(1, -1),
        });
      })
    );
    // console.log(cloneCard.author_id !== req.user._id && cloneCard);
    // // Check if cloneCard exist and current user isn't card's author
    // if (cloneCard && cloneCard.author_id !== req.user._id) {
    //   const availableCard = await Card.find({
    //     original_id: cloneCard._id,
    //     user_id: req.user._id,
    //   });
    //   if (availableCard.length !== 0) {
    //     res.status(Constants.FORBIDDEN);
    //     throw new Error("You'd already owned this card");
    //   } else {
    //     const newCard = await Card.create({
    //       _id: uuidv4(),
    //       desk_id: cloneCardDeskId,
    //       author_id: cloneCard.author_id,
    //       original_id: cloneCardId,
    //       user_id: req.user._id,
    //       status: "NEW",
    //       level: 0,
    //       last_preview: JSON.stringify(new Date()).slice(1, -1),
    //       vocab: cloneCard.vocab,
    //       description: cloneCard.description,
    //       sentence: cloneCard.sentence,
    //       vocab_audio: cloneCard.vocab_audio,
    //       sentence_audio: cloneCard.sentence_audio,
    //       modified_time: JSON.stringify(new Date()).slice(1, -1),
    //     });
    //     res.status(200).json(newCard);
    //   }
    // } else {
    //   res.status(Constants.NOT_FOUND);
    //   throw new Error(
    //     "Cannot clone card because card is not valid or you'd already owned this card!"
    //   );
    // }
  } else {
    res.status(Constants.NOT_FOUND);
    throw new Error("Id provide to clone card is not valid");
  }
});

//@desc Update Card
//@route PUT api/card/:cardId
//@access private
const updateCard = asyncHandler(async (req, res, next) => {
  const card = await Card.findById(req.params.cardId);

  if (card) {
    if (card.author_id === req.user._id) {
      // AUTHOR handling
      await Card.findByIdAndUpdate(
        req.params.cardId,
        {
          status: req.body.status || card.status,
          level: req.body.level || card.level,
          last_preview: req.body.last_preview || card.last_preview,
          modified_time: req.body.modified_time || card.modified_time,
          vocab: req.body.vocab || card.vocab,
          description: req.body.description || card.description,
          sentence: req.body.sentence || card.sentence,
          vocab_audio: req.body.vocab_audio || card.vocab_audio,
          sentence_audio: req.body.sentence_audio || card.sentence_audio,
        },
        { new: true }
      );
      // after updating specific card, let update all its cloned versions
      if (
        req.body.vocab !== card.vocab ||
        req.body.description !== card.description ||
        req.body.sentence !== card.sentence ||
        req.body.vocab_audio !== card.vocab_audio ||
        req.body.sentence_audio !== card.sentence_audio
      ) {
        const listClonedVersion = await Card.find({ original_id: card._id });
        if (listClonedVersion.length !== 0) {
          console.log("Updaten cloned card version");
          await Promise.all(
            listClonedVersion.map((item) => {
              return Card.findByIdAndUpdate(item._id, {
                status: "new",
                level: 0,
                last_preview: req.body.last_preview || card.last_preview,
                modified_time: req.body.modified_time || card.modified_time,
                vocab: req.body.vocab || card.vocab,
                description: req.body.description || card.description,
                sentence: req.body.sentence || card.sentence,
                vocab_audio: req.body.vocab_audio || card.vocab_audio,
                sentence_audio: req.body.sentence_audio || card.sentence_audio,
              });
            })
          );
        }
      }
      res.status(200).json(card);
    } else {
      // UNAUTHOR handling
      await Card.findByIdAndUpdate(
        req.params.cardId,
        {
          status: req.body.status || card.status,
          level: req.body.level || card.level,
          last_preview: req.body.last_preview || card.last_preview,
          modified_time: req.body.modified_time || card.modified_time,
        },
        { new: true }
      );
      res.status(200).json({
        message: "Update cloned card successfully!",
      });
    }
  } else {
    res.status(Constants.NOT_FOUND);
    throw new Error("Card is not valid");
    // console.log("Here");
    // const newCard = Card.collection.insertOne({
    //   ...req.body,
    // });
    // if (newCard) {
    //   res.status(200).json(newCard);
    // } else {
    //   res.status(Constants.FORBIDDEN);
    //   throw new Error("Forbiddant !");
    // }
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
