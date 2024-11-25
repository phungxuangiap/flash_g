const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("DB is connecting...");
    const connect = await mongoose.connect(
      "mongodb+srv://xuangiap0806:dEqYsnFiNQfU7WEk@cluster0.nshxi.mongodb.net/Flash_G?retryWrites=true&w=majority&appName=Cluster0"
    );
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
