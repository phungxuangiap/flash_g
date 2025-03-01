const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: {
    type: String,
    require: [true],
  },
  full_name: {
    type: String,
    require: [true, "Please add your fullname"],
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
  modified_time: {
    type: String,
    require: [true],
  },
});

module.exports = mongoose.model("User", userSchema);
