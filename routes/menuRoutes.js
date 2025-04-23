const express = require("express");
const upload = require("../middleware/upload");
const router = express.Router();

const {
  createMenu,
  getAllMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
  downloadMenuPDF
} = require("../controllers/menuController");

router.post("/", upload.single("image"), createMenu);
router.get("/", getAllMenus);
router.get("/:id", getMenuById);
router.put("/:id", upload.single("image"), updateMenu);
router.delete("/:id", deleteMenu);
router.get("/:id/pdf", downloadMenuPDF);

module.exports = router;
