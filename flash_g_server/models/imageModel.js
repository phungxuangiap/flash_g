const mongoose = require("mongoose");

const imageSchema = mongoose.Schema({
  _id: {
    type: String,
    require: [true],
  },
  desk_id: {
    type: String,
    require: [true],
  },
  img_url: {
    type: String,
    require: [true, "Please provide enough field for ImageModel"],
  },
  type: {
    type: String,
    require: [true, "Please provide enough field for ImageModel"],
  },
  modified_time: {
    type: String,
    require: [true],
  },
});

module.exports = mongoose.model("Image", imageSchema);
