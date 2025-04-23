const express = require("express");
const upload = require("../middleware/upload");

const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
} = require("../controllers/eventController");


router.post("/", upload.single("image"), createEvent);
router.put("/:id", upload.single("image"), updateEvent);
router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.delete("/:id", deleteEvent);

module.exports = router;
