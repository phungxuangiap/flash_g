const asyncHandler = require("express-async-handler");
const { Constants } = require("../middlewares/constants");
const Card = require("../models/cardModel");
const { DistanceFromDateToDate } = require("../helper");
const { v4: uuidv4 } = require("uuid");
const { getAllDesks } = require("./DeskController");
const Desk = require("../models/deskModel");
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

//@desc Create New Card
//@route POST api/card/:deskId
//@access private
const createCard = asyncHandler(async (req, res, next) => {
  console.log("Ahihi");
  const {
    vocab,
    description,
    sentence,
    vocab_audio,
    sentence_audio,
    last_preview,
    modified_time,
  } = req.body;
  if (
    !vocab ||
    !description ||
    !sentence ||
    !vocab_audio ||
    !sentence_audio ||
    !last_preview ||
    !modified_time
  ) {
    res.status(Constants.NOT_FOUND);
    throw new Error("Cannot create card because of missing field!");
  } else {
    let card_id = uuidv4();
    const action = req.query.action;
    // action variable here is used for separate clone and create card service.
    // action that don't have value is create method another wise in case clone will be clone
    if (!action) {
      const newCard = await Card.create({
        _id: card_id,
        desk_id: req.params.deskId,
        original_id: card_id,
        author_id: req.user._id,
        user_id: req.user._id,
        status: "new",
        level: 0,
        last_preview,
        vocab,
        description,
        sentence,
        vocab_audio,
        sentence_audio,
        modified_time,
      });
      const listClonedDeskOfCard = await Desk.find({
        original_id: req.params.deskId,
      });
      console.log("LIST CLONED", req.params.deskId);
      if (listClonedDeskOfCard) {
        await Promise.all(
          listClonedDeskOfCard.map((desk) => {
            let clonedCardId = uuidv4();
            if (desk._id !== desk.original_id) {
              return Card.create({
                _id: clonedCardId,
                desk_id: desk._id,
                original_id: card_id,
                author_id: req.user._id,
                user_id: desk.user_id,
                status: "new",
                level: 0,
                last_preview,
                vocab,
                description,
                sentence,
                vocab_audio,
                sentence_audio,
                modified_time,
              });
            }
          })
        );
      }
      res.status(200).json(newCard);
    } else {
      next();
    }
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
      const updatedCard = await Card.findByIdAndUpdate(
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
              return Card.findByIdAndUpdate(
                item._id,
                {
                  status: "new",
                  level: 0,
                  last_preview: req.body.last_preview || card.last_preview,
                  modified_time: req.body.modified_time || card.modified_time,
                  vocab: req.body.vocab || card.vocab,
                  description: req.body.description || card.description,
                  sentence: req.body.sentence || card.sentence,
                  vocab_audio: req.body.vocab_audio || card.vocab_audio,
                  sentence_audio:
                    req.body.sentence_audio || card.sentence_audio,
                },
                { new: true }
              );
            })
          );
        }
      }
      res.status(200).json(updatedCard);
    } else {
      // UNAUTHOR handling
      const updatedCard = await Card.findByIdAndUpdate(
        req.params.cardId,
        {
          status: req.body.status || card.status,
          level: req.body.level || card.level,
          last_preview: req.body.last_preview || card.last_preview,
          modified_time: req.body.modified_time || card.modified_time,
        },
        { new: true }
      );
      res.status(200).json(updatedCard);
    }
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
    const listDeletedCard = await Card.find({ original_id: req.params.cardId });
    if (listDeletedCard) {
      await Promise.all(
        listDeletedCard.map((card) => {
          return Card.findByIdAndDelete(card._id);
        })
      );
    }
    res
      .status(200)
      .json({ message: "Delete card and cloned version successfully!" });
  } else {
    res.status(Constants.NOT_FOUND);
    throw new Error("Not Found");
  }
});

//@desc Create Multiple Cards
//@route POST api/card/multiple/:deskId
//@access private
const createMultipleCards = asyncHandler(async (req, res, next) => {
  const desk_id = req.params.deskId;
  const listNewCards = req.body.list_new_cards;
  const createCardFunc = async (card) => {
    const card_id = uuidv4();
    const newCard = await Card.create({
      _id: card_id,
      desk_id: req.params.deskId,
      original_id: card_id,
      author_id: req.user._id,
      user_id: req.user._id,
      status: card.status,
      level: 0,
      last_preview: card.last_preview,
      vocab: card.vocab,
      description: card.description,
      sentence: card.sentence,
      vocab_audio: card.vocab_audio,
      sentence_audio: card.sentence_audio,
      modified_time: card.modified_time,
    });
    const listClonedDeskOfCard = await Desk.find({
      original_id: req.params.deskId,
    });
    console.log("LIST CLONED", req.params.deskId);
    if (listClonedDeskOfCard) {
      await Promise.all(
        listClonedDeskOfCard.map((desk) => {
          let clonedCardId = uuidv4();
          if (desk._id !== desk.original_id) {
            return Card.create({
              _id: clonedCardId,
              desk_id: desk._id,
              original_id: card_id,
              author_id: req.user._id,
              user_id: desk.user_id,
              status: card.status,
              level: 0,
              last_preview: card.last_preview,
              vocab: card.vocab,
              description: card.description,
              sentence: card.sentence,
              vocab_audio: card.vocab_audio,
              sentence_audio: card.sentence_audio,
              modified_time: card.modified_time,
            });
          }
        })
      );
    }
    return newCard;
  };
  if (listNewCards) {
    res.json(
      await Promise.all(
        listNewCards.map((card) => {
          return createCardFunc(card);
        })
      )
    );
  }
});

//@desc Update Multiple Cards
//@route PUT api/card/multiple/:deskId
//@access private
const updateMultipleCards = asyncHandler(async (req, res, next) => {
  const listUpdatedCard = req.body.list_update_cards;
  const updateCardFunc = async (card) => {
    if (card) {
      if (card.author_id === req.user._id) {
        // AUTHOR handling
        const updatedCard = await Card.findByIdAndUpdate(
          req.params.cardId,
          {
            status: card.status,
            level: card.level,
            last_preview: card.last_preview,
            modified_time: card.modified_time,
            vocab: card.vocab,
            description: card.description,
            sentence: card.sentence,
            vocab_audio: card.vocab_audio,
            sentence_audio: card.sentence_audio,
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
                  sentence_audio:
                    req.body.sentence_audio || card.sentence_audio,
                });
              })
            );
          }
        }
        return updatedCard;
      } else {
        // UNAUTHOR handling
        const updatedCard = await Card.findByIdAndUpdate(
          req.params.cardId,
          {
            status: req.body.status || card.status,
            level: req.body.level || card.level,
            last_preview: req.body.last_preview || card.last_preview,
            modified_time: req.body.modified_time || card.modified_time,
          },
          { new: true }
        );

        return updateCard;
      }
    } else {
      const newCard = Card.collection.insertOne({
        ...req.body,
      });
      return newCard;
    }
  };
  if (listUpdatedCard) {
    res.json(
      await Promise.all(
        listUpdatedCard.map((card) => {
          return updateCardFunc(card);
        })
      )
    );
  } else {
    res.status(Constants.NOT_FOUND);
    throw new Error("Missing request's body");
  }
});

module.exports = {
  getAllCardsOfDesk,
  updateCard,
  deleteCard,
  createCard,
  getAllCards,
  createMultipleCards,
};
