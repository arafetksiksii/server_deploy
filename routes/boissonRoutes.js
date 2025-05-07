const express = require("express");
const router = express.Router();

const {
  createBoisson,
  getAllBoissons,
  getBoissonById,
  updateBoisson,
  deleteBoisson
} = require("../controllers/boissonController");

// No more image upload needed
router.post("/", createBoisson);
router.put("/:id", updateBoisson);

router.get("/", getAllBoissons);
router.get("/:id", getBoissonById);
router.delete("/:id", deleteBoisson);

module.exports = router;
