const express = require("express");
const {
  deleteDesk,
  getAllDesks,
  updateDesk,
  createNewDesk,
  deleteAllDesks,
  cloneDesk,
  getGlobalDesks,
} = require("../controllers/DeskController");
const validationHandler = require("../middlewares/validationHandler");
const router = express();
router.use(validationHandler);
router
  .route("/")
  .get(getAllDesks)
  .post(createNewDesk)
  .delete(deleteAllDesks)
  .get(getGlobalDesks);
router.route("/:id").delete(deleteDesk).put(updateDesk).post(cloneDesk);

module.exports = router;
