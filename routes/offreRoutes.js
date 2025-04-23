const express = require("express");
const router = express.Router();
const {
  createOffre,
  getAllOffres,
  getOffreById,
  updateOffre,
  deleteOffre
} = require("../controllers/offreController");

router.post("/", createOffre);
router.get("/", getAllOffres);
router.get("/:id", getOffreById);
router.put("/:id", updateOffre);
router.delete("/:id", deleteOffre);

module.exports = router;
