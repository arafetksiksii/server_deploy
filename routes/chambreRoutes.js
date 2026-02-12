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
  addImageToChambre,
  removeImageFromChambre,
} = require("../controllers/chambreController");

router.post("/", upload.fields([
  { name: "imagePrincipale", maxCount: 1 },
  { name: "images", maxCount: 20 }
]), createChambre);
router.get("/", getAllChambres);
router.get("/:id", getChambreById);
router.put("/:id", upload.fields([
  { name: "imagePrincipale", maxCount: 1 },
  { name: "images", maxCount: 20 }
]), updateChambre);
router.delete("/:id", deleteChambre);

// Lier un menu à une Chambre
router.put("/:id/add-menu", addMenuToChambre);

// Ajouter une image supplémentaire à une chambre
router.post("/:id/add-image", upload.single("image"), addImageToChambre);

// Supprimer une image d'une chambre
router.put("/:id/remove-image", removeImageFromChambre);

module.exports = router;
