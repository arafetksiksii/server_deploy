const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // ✅ Your multer config

const {
  createSpa,
  getAllSpas,
  getSpaById,
  updateSpa,
  deleteSpa,
  toggleSpaReservable
} = require("../controllers/spaController");

// ✅ Create a Spa (categories only)
router.post("/", upload.single("image"), createSpa);

// ✅ Get all Spas
router.get("/", getAllSpas);

// ✅ Get Spa by ID
router.get("/:id", getSpaById);

// ✅ Update Spa (replace categories)
router.put("/:id", upload.single("image"), updateSpa);

// ✅ Delete Spa
router.delete("/:id", deleteSpa);





module.exports = router;
