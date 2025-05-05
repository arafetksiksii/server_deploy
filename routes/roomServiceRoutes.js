const express = require("express");
const router = express.Router();

const {
  createRoomService,
  getAllRoomServices,
  getRoomServiceById,
  updateRoomService,
  deleteRoomService
} = require("../controllers/roomServiceController");

router.post("/", createRoomService);
router.get("/", getAllRoomServices);
router.get("/:id", getRoomServiceById);
router.put("/:id", updateRoomService);
router.delete("/:id", deleteRoomService);

module.exports = router;
