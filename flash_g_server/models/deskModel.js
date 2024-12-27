const mongoose = require("mongoose");

const deskSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    require: [true],
  },
  id: {
    type: mongoose.Schema.ObjectId,
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
