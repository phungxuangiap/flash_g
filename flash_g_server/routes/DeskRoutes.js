const express = require("express");
const {
  deleteDesk,
  getAllDesks,
  updateDesk,
  createNewDesk,
} = require("../controllers/DeskController");
const router = express();

router.route("/").get(getAllDesks).post(createNewDesk);
router.route("/:id").delete(deleteDesk).put(updateDesk);

module.exports = router;
