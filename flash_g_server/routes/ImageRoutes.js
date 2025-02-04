const express = require("express");
const {
  getImageOfDeskId,
  addImageOfDeskId,
  deleteImageOfDesk,
} = require("../controllers/ImageController");
const validationHandler = require("../middlewares/validationHandler");

const router = express();
const { storage } = require("../config/cloudinary.config");
const multer = require("multer");
const upload = multer({ storage });
router.use(validationHandler);
router.route("/upload").post(upload.single("image"), (req, res, next) => {
  res.status(200).json(req.file);
});
router
  .route("/:desk_id")
  .get(getImageOfDeskId)
  .post(addImageOfDeskId)
  .delete(deleteImageOfDesk);

module.exports = router;
