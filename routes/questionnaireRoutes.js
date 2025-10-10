const express = require("express");
const router = express.Router();
const questionnaireController = require("../controllers/questionnaireController");

// CRUD routes
router.post("/", questionnaireController.createQuestionnaire);
router.get("/", questionnaireController.getAllQuestionnaires);
router.get("/:id", questionnaireController.getQuestionnaireById);
router.put("/:id", questionnaireController.updateQuestionnaire);
router.delete("/:id", questionnaireController.deleteQuestionnaire);

module.exports = router;
