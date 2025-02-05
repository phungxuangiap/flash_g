const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const { Constants } = require("../middlewares/constants");
const Image = require("../models/imageModel");
const Desk = require("../models/deskModel");

//@desc Get Image of Desk Id
//@route GET api/image/:desk_id
//@access Private
const getImageOfDeskId = asyncHandler(async (req, res, next) => {
  console.log(req.params.desk_id);
  const imageArray = await Image.find({ desk_id: req.params.desk_id });

  const image = imageArray[0] ? imageArray[0] : undefined;
  if (image) {
    res.status(200).json(image);
  } else {
    res.status(Constants.NOT_FOUND);
    throw new Error(`Cannot find any image of desk_id: ${req.params.desk_id}`);
  }
});

//@desk Add image of Desk id
//@route POST api/image/:desk_id
//@access Private
const addImageOfDeskId = asyncHandler(async (req, res, next) => {
  console.log("Upload here");
  const desk = await Desk.findById(req.params.desk_id);

  if (!req.body.img_url) {
    res.status(Constants.NOT_FOUND);
    throw new Error("You missing field");
  } else {
    if (!desk) {
      res.status(Constants.NOT_FOUND);
      throw new Error("Cannot find desk with provided Id");
    } else {
      if (desk.user_id === req.user._id) {
        const image = await Image.find({ desk_id: desk._id });
        if (image.length !== 0) {
          //handle update image of desk here
          const updatedImage = await Image.findByIdAndUpdate(image[0]._id, {
            _id: image[0]._id,
            desk_id: image[0].desk_id,
            img_url: req.body.img_url,
            modified_time: req.body.modified_time,
          });
          if (updatedImage) {
            res.status(200).json(updatedImage);
          } else {
            res.status(Constants.FORBIDDEN);
            throw new Error("Update desk image error");
          }
        } else {
          //create new image here
          const imgId = uuidv4();
          const newImage = await Image.create({
            _id: imgId,
            desk_id: req.params.desk_id,
            img_url: req.body.img_url,
            modified_time: req.body.modified_time,
          });
          if (newImage) {
            res.status(200).json(newImage);
          } else {
            res.status(Constants.FORBIDDEN);
            throw new Error("Create new image of desk id error");
          }
        }
      } else {
        res.status(Constants.UNAUTHORIZED);
        throw new Error(
          "You don't have the permission to add image to this desk !"
        );
      }
    }
  }
});

//@desc Delete Image of Desk
//@route DELETE api/image/:desk_id
//@access Private
const deleteImageOfDesk = asyncHandler(async (req, res, next) => {
  const desk_id = req.params.desk_id;
  if (desk_id) {
    const image = await Image.find({ desk_id: req.params.desk_id });
    if (image) {
      await Image.findByIdAndDelete(image._id);
      res.status(200).json({ message: "Delete Image successfully!" });
    } else {
      res.status(Constants.NOT_FOUND);
      throw new Error("Image is not valid");
    }
  }
});

module.exports = {
  getImageOfDeskId,
  addImageOfDeskId,
  deleteImageOfDesk,
};
