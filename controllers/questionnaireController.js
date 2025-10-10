const Questionnaire = require("../models/Questionnaire");

// ✅ Create a new questionnaire
exports.createQuestionnaire = async (req, res) => {
  try {
    const questionnaire = new Questionnaire(req.body);
    const saved = await questionnaire.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get all questionnaires
exports.getAllQuestionnaires = async (req, res) => {
  try {
    const questionnaires = await Questionnaire.find();
    res.json(questionnaires);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get questionnaire by ID
exports.getQuestionnaireById = async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findById(req.params.id);
    if (!questionnaire) {
      return res.status(404).json({ error: "Questionnaire not found" });
    }
    res.json(questionnaire);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update questionnaire by ID
exports.updateQuestionnaire = async (req, res) => {
  try {
    const updated = await Questionnaire.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return the updated document
    );
    if (!updated) {
      return res.status(404).json({ error: "Questionnaire not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete questionnaire by ID
exports.deleteQuestionnaire = async (req, res) => {
  try {
    const deleted = await Questionnaire.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Questionnaire not found" });
    }
    res.json({ message: "Questionnaire deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
