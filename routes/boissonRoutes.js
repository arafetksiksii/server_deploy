const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // ✅ import Multer

const {
  createBoisson,
  getAllBoissons,
  getBoissonById,
  updateBoisson,
  deleteBoisson
} = require("../controllers/boissonController");

// ✅ Apply Multer to POST/PUT
router.post("/", upload.single("image"), createBoisson);
router.put("/:id", upload.single("image"), updateBoisson);

router.get("/", getAllBoissons);
router.get("/:id", getBoissonById);
router.delete("/:id", deleteBoisson);

module.exports = router;
