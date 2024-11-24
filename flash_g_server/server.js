// Server code here
const express = require("express");
const { getUser } = require("./routes/UserRoutes");

const app = express();
app.use(express.json());
const port = process.env.PORT || 5000;

// app.use("/api", getUser);
app.use("/api/desk", require("./routes/DeskRoutes"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
