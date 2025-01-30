const mongoose = require("mongoose");

const deskSchema = mongoose.Schema({
  _id: {
    type: String,
    require: [true],
  },
  author_id: {
    type: String,
    require: [true],
  },
  original_id: {
    type: String,
    require: [true],
  },
  description: {
    type: String,
    require: [true],
  },
  user_id: {
    type: String,
    require: [true],
  },
  access_status: {
    type: String,
    require: [true],
  },
  title: {
    type: String,
    require: [true, "Please add desk's title"],
  },
  primary_color: {
    type: String,
  },
  new_card: {
    type: Number,
  },
  inprogress_card: {
    type: Number,
  },
  preview_card: {
    type: Number,
  },
  modified_time: {
    type: String,
    require: [true],
  },
});

module.exports = mongoose.model("Desk", deskSchema);
