// Server code here
require("dotenv").config();
const express = require("express");
const { getUser } = require("./routes/UserRoutes");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./config/dbConnection");
const db = connectDB();
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT || 5000;

app.use("/api/user", require("./routes/UserRoutes"));
app.use("/api/desk", require("./routes/DeskRoutes"));
app.use("/api/card", require("./routes/CardRoutes"));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
