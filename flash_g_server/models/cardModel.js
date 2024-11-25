const mongoose = require("mongoose");

const Status = {
  NEW: "new",
  INPROGRESS: "in_progress",
  PREVIEW: "preview",
};
const cardSchema = mongoose.Schema({
  desk_id: {
    type: mongoose.Schema.ObjectId,
    require: [true],
  },
  status: {
    type: String,
    require: [true],
  },
  level: {
    type: Number,
    require: [true],
  },
  last_preview: {
    type: Timestamp,
    require: [true],
  },
  vocab: {
    type: String,
    require: [true],
  },
  description: {
    type: String,
    require: [true],
  },
  sentence: {
    type: String,
    require: [true],
  },
  vocab_audio: {
    type: Audio,
    require: [true],
  },
  sentence_audio: {
    type: Audio,
    require: [true],
  },
});

module.exports = mongoose.Model("Card", cardSchema);
