const Spa = require("../models/Spa");

exports.createSpa = async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.file ? req.file.path : "";

    const spa = new Spa({ name, description, image });
    await spa.save();

    const io = req.app.get("io");
    io.emit("spaCreated", spa);

    res.status(201).json(spa);
  } catch (err) {
    console.error("❌ Error creating spa:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.getAllSpas = async (req, res) => {
  try {
    const spas = await Spa.find();
    res.status(200).json(spas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSpaById = async (req, res) => {
  try {
    const spa = await Spa.findById(req.params.id);
    if (!spa) return res.status(404).json({ message: "Spa not found" });
    res.status(200).json(spa);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSpa = async (req, res) => {
  try {
    const { name, description } = req.body;
    const updateFields = { name, description };

    if (req.file) {
      updateFields.image = req.file.path;
    }

    const spa = await Spa.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!spa) return res.status(404).json({ message: "Spa not found" });

    const io = req.app.get("io");
    io.emit("spaUpdated", spa);

    res.status(200).json(spa);
  } catch (err) {
    console.error("❌ Error updating spa:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteSpa = async (req, res) => {
  try {
    const spa = await Spa.findByIdAndDelete(req.params.id);
    if (!spa) return res.status(404).json({ message: "Spa not found" });

    const io = req.app.get("io");
    io.emit("spaDeleted", spa._id);

    res.status(200).json({ message: "Spa deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
