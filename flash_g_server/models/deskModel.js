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
  progress_new_card: {
    type: Array,
  },
  progress_progress_card: {
    type: Array,
  },
  progress_preview_card: {
    type: Array,
  },
});

module.exports = mongoose.model("Desk", deskSchema);
