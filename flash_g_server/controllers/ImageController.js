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
  const desk = await Desk.findById(req.params.desk_id);

  if (!req.body.img_url || !req.body.type) {
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
            type: req.body.type,
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
            type: req.body.type,
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

//@desc Update Image of Desk
//@route DELETE api/image/:desk_id
//@access Private
const updateImageOfDesk = asyncHandler(async (req, res, next) => {
  const desk_id = req.params.desk_id;
  if (desk_id) {
    const image = await Image.find({ desk_id: req.params.desk_id });
    if (image[0]) {
      console.log("Image", image[0]._id);
      await Image.findByIdAndUpdate(
        image[0]._id,
        {
          desk_id: req.body.desk_id,
          img_url: req.body.img_url,
          type: req.body.type,
          modified_time: req.body.modified_time,
        },
        { new: true }
      )
        .then((response) => {
          console.log(response.data);
          res.status(200).json(response);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      res.status(Constants.NOT_FOUND);
      throw new Error("Image is not valid");
    }
  }
});

//@desc Get all images of provided desks
//@route GET api/image/?multiple_desk=true
//@access Private
const getImagesOfDesks = asyncHandler(async (req, res, next) => {
  const isMultipleDesks = req.query.multiple_desk;
  let listImages = [];
  if (isMultipleDesks) {
    const desks = req.body.list_desk;
    if (desks.length !== 0) {
      res.json(
        await Promise.all(
          desks.map((deskId) => {
            return Image.find({ desk_id: deskId }).then((response) => {
              if (response[0]) {
                return response[0];
              } else {
                return undefined;
              }
            });
          })
        )
      );
    } else {
      res.json("List Desk id is empty");
    }
  } else {
    next();
  }
});

module.exports = {
  getImageOfDeskId,
  addImageOfDeskId,
  deleteImageOfDesk,
  getImagesOfDesks,
  updateImageOfDesk,
};
