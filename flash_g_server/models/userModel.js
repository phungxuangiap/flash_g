const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    require: [true],
  },
  user_name: {
    type: String,
    require: [true, "Please add your user name"],
  },
  email: {
    type: String,
    require: [true, "Please add your email"],
  },
  password: {
    type: String,
    require: [true, "Please add your password"],
  },
});

module.exports = mongoose.model("User", userSchema);
