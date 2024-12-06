const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("DB is connecting...");
    const connect = await mongoose.connect(process.env.DB_CONNECTION);
    console.log(
      "DB connected",
      connect.connection.host,
      connect.connection.name
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
module.exports = connectDB;
