const QuestionnaireResponse = require("../models/QuestionnaireResponse");
const Questionnaire = require("../models/Questionnaire");

// ✅ Create a new response (client submits answers)
exports.createResponse = async (req, res) => {
  try {
    const { questionnaireId, responses } = req.body;

    // optional check: ensure questionnaire exists
    const questionnaire = await Questionnaire.findById(questionnaireId);
    if (!questionnaire) {
      return res.status(404).json({ error: "Questionnaire not found" });
    }

    const newResponse = new QuestionnaireResponse({
      questionnaireId,
      responses,
    });

    const savedResponse = await newResponse.save();
    res.status(201).json(savedResponse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get all responses (admin can view all)
exports.getAllResponses = async (req, res) => {
  try {
    const responses = await QuestionnaireResponse.find()
      .populate("questionnaireId", "title description");
    res.json(responses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all responses for a specific questionnaire
exports.getResponsesByQuestionnaire = async (req, res) => {
  try {
    const { questionnaireId } = req.params;
    const responses = await QuestionnaireResponse.find({ questionnaireId });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get a single response by ID
exports.getResponseById = async (req, res) => {
  try {
    const response = await QuestionnaireResponse.findById(req.params.id)
      .populate("questionnaireId", "title");
    if (!response) {
      return res.status(404).json({ error: "Response not found" });
    }
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete a response
exports.deleteResponse = async (req, res) => {
  try {
    const deleted = await QuestionnaireResponse.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Response not found" });
    }
    res.json({ message: "Response deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
