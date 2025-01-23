const asyncHandler = require("express-async-handler");
const { Constants } = require("../middlewares/constants");
const Desk = require("../models/deskModel");
const { v4: uuidv4 } = require("uuid");
const { param } = require("../routes/UserRoutes");
//@desc Get All Desks
//@route GET /api/desk/
//@access private
const getAllDesks = asyncHandler(async (req, res, next) => {
  const allDesk = await Desk.find({ user_id: req.user._id });
  if (allDesk) {
    res.status(200).json(allDesk);
  } else {
    res.status(Constants.NOT_FOUND);
    throw new Error("Not found");
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
  const { title, primary_color } = req.body;
  if (!title || !primary_color) {
    res.status(Constants.NOT_FOUND);
    throw new Error("All fields are mandatory");
  } else {
    const id = uuidv4();
    const newDesk = await Desk.create({
      _id: id,
      user_id: req.user._id,
      author_id: req.user._id,
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
  if (clonedDeskId) {
    const clonedDesk = await Desk.findById(clonedDeskId);
    console.log(clonedDesk.author_id !== req.user._id && clonedDesk);
    if (clonedDesk && clonedDesk.author_id !== req.user._id) {
      const availableDesk = await Desk.find({
        original_id: clonedDesk._id,
        user_id: req.user._id,
      });
      if (availableDesk.length !== 0) {
        res.status(Constants.FORBIDDEN);
        throw new Error("You'd already owned this desk");
      } else {
        const newDesk = await Desk.create({
          _id: uuidv4(),
          user_id: req.user._id,
          author_id: clonedDesk.user_id,
          original_id: clonedDeskId,
          access_status: clonedDesk.access_status,
          title: clonedDesk.title,
          primary_color: clonedDesk.primary_color,
          new_card: 0,
          preview_card: 0,
          inprogress_card: 0,
          modified_time: JSON.stringify(new Date()).slice(1, -1),
        });
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
  const { title, primary_color, modified_time } = req.body;
  if (!title || !primary_color || !modified_time) {
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
    res.status(Constants.NOT_FOUND);
    throw new Error("Desk is not valid");

    // const newDesk = await Desk.collection.insertOne({
    //   _id: req.params.id,
    //   author_id: req.user._id,
    //   user_id: req.user._id,
    //   title: req.body.title,
    //   primary_color: req.body.primary_color,
    //   modified_time: req.modified_time,
    //   new_card: 0,
    //   preview_card: 0,
    //   inprogress_card: 0,
    // });

    // if (newDesk) {
    //   res.status(200).json(newDesk);
    // } else {
    //   res.status(Constants.FORBIDDEN);
    //   throw new Error("Forbiddent!");
    // }
  }
});

//@desc Create Desk, if exist Update
//@route PUT /api/desk/:id
//@access private
// const createUpdateDesk = asyncHandler(async (req, res, next) => {
//   console.log("HERE");
//   const isExist = await Desk.findById(req.params.id);
//   if (isExist) {
//     await Desk.findByIdAndUpdate(
//       req.params.id,
//       {
//         title: req.body.title,
//         primary_color: req.body.primary_color,
//         new_card: req.body.new_card,
//         inprogress_card: req.body.inprogress_card,
//         preview_card: req.body.preview_card,
//         modified_time: JSON.stringify(new Date()).slice(1, -1),
//       },
//       { new: true }
//     );
//     res.status(200).json({
//       status: "Update",
//       data: isExist,
//     });
//   } else {
//     const newDesk = await Desk.create({
//       user_id: req.user._id,
//       title: req.body.title,
//       primary_color: req.body.primary_color,
//       new_card: req.body.new_card,
//       inprogress_card: req.body.inprogress_card,
//       preview_card: req.body.preview_card,
//       modified_time: JSON.stringify(new Date()).slice(1, -1),
//     });
//     if (newDesk) {
//       res.status(200).json(newDesk);
//     } else {
//       res.status(Constants.FORBIDDEN);
//       throw new Error("Forbiddent!");
//     }
//   }
// });

module.exports = {
  getAllDesks,
  deleteDesk,
  deleteAllDesks,
  updateDesk,
  createNewDesk,
  cloneDesk,
};
