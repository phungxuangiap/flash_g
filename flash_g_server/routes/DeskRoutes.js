const express = require("express");
const {
  deleteDesk,
  getAllDesks,
  updateDesk,
  createNewDesk,
  deleteAllDesks,
  createUpdateDesk,
} = require("../controllers/DeskController");
const validationHandler = require("../middlewares/validationHandler");
const router = express();
router.use(validationHandler);
router.route("/").get(getAllDesks).post(createNewDesk).delete(deleteAllDesks);
router.route("/:id").delete(deleteDesk).put(updateDesk);

module.exports = router;
