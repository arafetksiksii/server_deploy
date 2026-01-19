const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  createChambre,
  getAllChambres,
  getChambreById,
  updateChambre,
  deleteChambre,
  addMenuToChambre,
} = require("../controllers/chambreController");

router.post("/", upload.single("image"), createChambre);
router.get("/", getAllChambres);
router.get("/:id", getChambreById);
router.put("/:id", upload.single("image"), updateChambre);
router.delete("/:id", deleteChambre);

// Lier un menu à une Chambre
router.put("/:id/add-menu", addMenuToChambre);

module.exports = router;
