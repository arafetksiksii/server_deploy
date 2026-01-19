const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  createTerrassePiscine,
  getAllTerrassesPiscine,
  getTerrassePiscineById,
  updateTerrassePiscine,
  deleteTerrassePiscine,
  addMenuToTerrassePiscine,
} = require("../controllers/terrassePiscineController");

router.post("/", upload.single("image"), createTerrassePiscine);
router.get("/", getAllTerrassesPiscine);
router.get("/:id", getTerrassePiscineById);
router.put("/:id", upload.single("image"), updateTerrassePiscine);
router.delete("/:id", deleteTerrassePiscine);

// Lier un menu à une Terrasse Piscine
router.put("/:id/add-menu", addMenuToTerrassePiscine);

module.exports = router;

