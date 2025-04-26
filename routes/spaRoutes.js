const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  createSpa,
  getAllSpas,
  getSpaById,
  updateSpa,
  deleteSpa
} = require("../controllers/spaController");

router.post("/", upload.single("image"), createSpa);
router.get("/", getAllSpas);
router.get("/:id", getSpaById);
router.put("/:id", upload.single("image"), updateSpa);
router.delete("/:id", deleteSpa);

module.exports = router;
