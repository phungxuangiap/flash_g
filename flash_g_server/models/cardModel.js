const mongoose = require("mongoose");

const Status = {
  NEW: "new",
  INPROGRESS: "in_progress",
  PREVIEW: "preview",
};
const cardSchema = mongoose.Schema({
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
  user_id: {
    type: String,
    require: [true],
  },
  desk_id: {
    type: String,
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
    type: String,
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
    type: String,
    require: [true],
  },
  sentence_audio: {
    type: String,
    require: [true],
  },
  modified_time: {
    type: String,
    require: [true],
  },
});

module.exports = mongoose.model("Card", cardSchema);
