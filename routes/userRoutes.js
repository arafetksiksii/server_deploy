const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// CRUD routes
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

// Change password route
router.post("/:id/change-password", userController.changePassword);

module.exports = router;
