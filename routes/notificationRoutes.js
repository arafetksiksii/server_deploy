const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// GET /notifications
router.get("/", notificationController.getAllNotifications);

module.exports = router;
