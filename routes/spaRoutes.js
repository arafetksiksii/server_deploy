const express = require("express");
const router = express.Router();

const {
  createSpa,
  getAllSpas,
  getSpaById,
  updateSpa,
  deleteSpa,
  toggleSpaReservable
} = require("../controllers/spaController");

// ✅ Create a Spa (categories only)
router.post("/", createSpa);

// ✅ Get all Spas
router.get("/", getAllSpas);

// ✅ Get Spa by ID
router.get("/:id", getSpaById);

// ✅ Update Spa (replace categories)
router.put("/:id", updateSpa);

// ✅ Delete Spa
router.delete("/:id", deleteSpa);

// ✅ Toggle reservable boolean
router.patch("/:id/toggle-reservable", toggleSpaReservable);



module.exports = router;
