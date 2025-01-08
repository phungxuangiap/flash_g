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
    const newDesk = await Desk.create({
      _id: uuidv4(),
      user_id: req.user._id,
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
//@desc Update Desk
//@route PUT /api/desk/:id
//@access private
const updateDesk = asyncHandler(async (req, res, next) => {
  const desk = await Desk.findById(req.params.id)
    .then((res) => {
      console.log("[RES]", res);
      return res;
    })
    .catch((err) => {
      console.log("[ERROR]", err);
      return null;
    });
  if (desk) {
    await Desk.findByIdAndUpdate(
      req.params.id,
      { ...req.body, modified_time: JSON.stringify(new Date()).slice(1, -1) },
      { new: true }
    );
    res.status(200).json(desk);
  } else {
    const newDesk = await Desk.collection.insertOne({
      ...req.body,
      modified_time: JSON.stringify(new Date()).slice(1, -1),
    });

    if (newDesk) {
      res.status(200).json(newDesk);
    } else {
      res.status(Constants.FORBIDDEN);
      throw new Error("Forbiddent!");
    }
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
};
