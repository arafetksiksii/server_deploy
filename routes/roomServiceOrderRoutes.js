const express = require("express");
const router = express.Router();
const roomServiceOrderController = require("../controllers/roomServiceOrderController");

router.post("/", roomServiceOrderController.createRoomServiceOrder);
router.get("/", roomServiceOrderController.getAllRoomServiceOrders);
router.get("/:id", roomServiceOrderController.getRoomServiceOrderById);
router.put("/:id", roomServiceOrderController.updateRoomServiceOrder);
router.delete("/:id", roomServiceOrderController.deleteRoomServiceOrder);

module.exports = router;
