const asyncHandler = require("express-async-handler");
const { Constants } = require("../middlewares/constants");
const Desk = require("../models/deskModel");
const Card = require("../models/cardModel");
const { v4: uuidv4 } = require("uuid");
const { param } = require("../routes/UserRoutes");
//@desc Get All Desks
//@route GET /api/desk/
//@access private
const getAllDesks = asyncHandler(async (req, res, next) => {
  const isGlobal = req.query.global;
  console.log(isGlobal);
  if (!isGlobal) {
    const allDesk = await Desk.find({ user_id: req.user._id });
    if (allDesk) {
      res.status(200).json(allDesk);
    } else {
      res.status(Constants.NOT_FOUND);
      throw new Error("Not found");
    }
  } else {
    next();
  }
});

//@desk Get All Global Desks
//@route GET /api/desk/?global=true
//@access private
const getGlobalDesks = asyncHandler(async (req, res, next) => {
  const isGlobal = req.query.global;
  if (isGlobal) {
    const globalPublicDesks = await Desk.find({
      $and: [
        { access_status: "PUBLIC" },
        { $expr: { $eq: ["$author_id", "$user_id"] } },
      ],
    });
    if (globalPublicDesks) {
      res.status(200).json(globalPublicDesks);
    } else {
      res.status(Constants.NOT_FOUND);
      throw new Error("Not found");
    }
  }
});

//@desc Delete Desk
//@route GET /api/desk/:id
//@access private
const deleteDesk = asyncHandler(async (req, res, next) => {
  const desk = await Desk.findById(req.params.id);
  if (desk) {
    await Desk.findByIdAndDelete(req.params.id);
    res.status(200).json(desk);
  } else {
    res.status(Constants.NOT_FOUND);
    throw new Error("Desk is not found");
  }
});

//@desc Delete All Desks
//@route DELETE /api/desk/
//@access private
const deleteAllDesks = asyncHandler(async (req, res, next) => {
  const deletedDesks = await Desk.deleteMany({ user_id: req.user._id });
  res.status(200).json({ status: "Delete all desk successfully" });
});

//@desc Create New Desk
//@route POST /api/desk/
//@access private
const createNewDesk = asyncHandler(async (req, res, next) => {
  const { title, primary_color, description } = req.body;
  if (!title || !primary_color || !description) {
    res.status(Constants.NOT_FOUND);
    throw new Error("All fields are mandatory");
  } else {
    const id = uuidv4();
    const newDesk = await Desk.create({
      _id: id,
      user_id: req.user._id,
      author_id: req.user._id,
      description: description,
      original_id: id,
      access_status: req.body.access_status || "PRIVATE",
      title,
      primary_color,
      new_card: 0,
      inprogress_card: 0,
      preview_card: 0,
      modified_time: JSON.stringify(new Date()).slice(1, -1),
    });

    console.log(newDesk);
    if (newDesk) {
      res.status(200).json(newDesk);
    } else {
      res.status(Constants.FORBIDDEN);
      throw new Error("Forbbiden");
    }
  }
});

//@desc Create clone desk
//@route POST /api/desk/:id
//@access private
const cloneDesk = asyncHandler(async (req, res, next) => {
  const clonedDeskId = req.params.id;
  console.log("clone...");
  if (clonedDeskId) {
    const clonedDesk = await Desk.findById(clonedDeskId);
    if (
      clonedDesk &&
      clonedDesk.author_id !== req.user._id &&
      clonedDesk.user_id !== req.user._id
    ) {
      const availableDesk = await Desk.find({
        original_id: clonedDesk._id,
        user_id: req.user._id,
      });
      if (availableDesk.length !== 0) {
        res.status(Constants.FORBIDDEN);
        throw new Error("You'd already owned this desk");
      } else {
        const listCards = await Card.find({ desk_id: clonedDeskId });
        console.log("Before create new Desk");
        const newDesk = await Desk.create({
          _id: uuidv4(),
          user_id: req.user._id,
          author_id: clonedDesk.author_id,
          original_id: clonedDesk.original_id,
          description: clonedDesk.description,
          access_status: clonedDesk.access_status,
          title: clonedDesk.title,
          primary_color: clonedDesk.primary_color,
          new_card: listCards.length,
          preview_card: 0,
          inprogress_card: 0,
          modified_time: JSON.stringify(new Date()).slice(1, -1),
        });
        console.log(
          "after creating new desk, before creating all cards of desk"
        );
        await Promise.all(
          listCards.map((card) => {
            return Card.create({
              _id: uuidv4(),
              desk_id: newDesk._id,
              author_id: card.author_id,
              original_id: card._id,
              user_id: req.user._id,
              status: "new",
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
        console.log("after creating all cards");
        res.status(200).json(newDesk);
      }
    } else {
      res.status(Constants.NOT_FOUND);
      throw new Error(
        "Cannot clone desk because desk is not valid or you'd already owned this desk!"
      );
    }
  } else {
    res.status(Constants.NOT_FOUND);
    throw new Error("Id provide to clone desk is not valid");
  }
});

//@desc Update Desk
//@route PUT /api/desk/:id
//@access private
const updateDesk = asyncHandler(async (req, res, next) => {
  const { title, primary_color, modified_time, description } = req.body;
  if (!title || !primary_color || !modified_time || !description) {
    res.status(Constants.NOT_FOUND);
    throw new Error("Missing some field to update successfully!");
  }
  const desk = await Desk.findById(req.params.id);
  if (desk) {
    if (desk.author_id === req.user._id) {
      console.log("AUTHOR");
      await Desk.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title,
          description: req.body.description,
          primary_color: req.body.primary_color,
          access_status: req.body.access_status,
          new_card: req.body.new_card || desk.new_card,
          inprogress_card: req.body.inprogress_card || desk.inprogress_card,
          preview_card: req.body.preview_card || desk.preview_card,
          modified_time: req.body.modified_time,
        },
        { new: true }
      );
      let desks = [];
      desks = await Desk.find({
        author_id: desk.author_id,
        original_id: desk._id,
      });
      if (desks.length !== 0) {
        await Promise.all(
          desks.map((item) => {
            return Desk.findByIdAndUpdate(item._id, {
              title: req.body.title,
              modified_time: req.body.modified_time,
              access_status: req.body.access_status,
              primary_color: req.body.primary_color,
            });
          })
        );
        console.log("HERERERE");
      }
      res.status(200).json(desk);
    } else {
      // unauthor update: Just allow update number of card of each type, restrict updating content of desk
      const updatedDesk = await Desk.find({
        user_id: req.user._id,
        _id: desk._id,
      });
      console.log(updatedDesk, "UPDATED_DESK");
      if (updatedDesk.length !== 0) {
        await Desk.findByIdAndUpdate(updatedDesk[0]._id, {
          new_card: req.body.new_card,
          inprogress_card: req.body.inprogress_card,
          preview_card: req.body.preview_card,
          modified_time: req.body.modified_time,
        });

        res.status(200).json({
          message: "Update unauthorized desk successfully!",
          data: updatedDesk[0],
        });
      } else {
        res.status(Constants.FORBIDDEN);
        throw new Error("Desk with provided id is not valid");
      }
    }
  } else {
    const newDesk = await Desk.create({
      _id: req.body._id,
      user_id: req.body.user_id,
      author_id: req.body.author_id,
      description: description,
      original_id: req.body.original_id,
      access_status: req.body.access_status || "PRIVATE",
      title,
      primary_color,
      new_card: 0,
      inprogress_card: 0,
      preview_card: 0,
      modified_time: JSON.stringify(new Date()).slice(1, -1),
    });
  }
});

module.exports = {
  getAllDesks,
  deleteDesk,
  deleteAllDesks,
  updateDesk,
  createNewDesk,
  cloneDesk,
  getGlobalDesks,
};
