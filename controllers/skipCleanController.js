const SkipClean = require("../models/SkipClean");

// ✅ Create new skip clean request
exports.createSkipClean = async (req, res) => {
  try {
    const skipClean = new SkipClean(req.body);
    const saved = await skipClean.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get all skip clean requests
exports.getAllSkipCleans = async (req, res) => {
  try {
    const skips = await SkipClean.find();
    res.json(skips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get skip clean request by ID
exports.getSkipCleanById = async (req, res) => {
  try {
    const skip = await SkipClean.findById(req.params.id);
    if (!skip) {
      return res.status(404).json({ error: "SkipClean request not found" });
    }
    res.json(skip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update skip clean request
exports.updateSkipClean = async (req, res) => {
  try {
    const updated = await SkipClean.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "SkipClean request not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete skip clean request
exports.deleteSkipClean = async (req, res) => {
  try {
    const deleted = await SkipClean.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "SkipClean request not found" });
    }
    res.json({ message: "SkipClean request deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
