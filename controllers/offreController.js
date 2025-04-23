const OffreSpeciale = require("../models/OffreSpeciale");

exports.createOffre = async (req, res) => {
  try {
    const offre = new OffreSpeciale(req.body);
    await offre.save();

    // 🔴 Emit new offer
    const io = req.app.get("io");
    io.emit("offreCreated", offre);

    res.status(201).json(offre);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllOffres = async (req, res) => {
  try {
    const offres = await OffreSpeciale.find();
    res.status(200).json(offres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOffreById = async (req, res) => {
  try {
    const offre = await OffreSpeciale.findById(req.params.id);
    if (!offre) return res.status(404).json({ message: "Offre not found" });
    res.status(200).json(offre);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOffre = async (req, res) => {
  try {
    const offre = await OffreSpeciale.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!offre) return res.status(404).json({ message: "Offre not found" });

    // 🔵 Emit update
    const io = req.app.get("io");
    io.emit("offreUpdated", offre);

    res.status(200).json(offre);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteOffre = async (req, res) => {
  try {
    const offre = await OffreSpeciale.findByIdAndDelete(req.params.id);
    if (!offre) return res.status(404).json({ message: "Offre not found" });

    // 🟠 Emit deletion
    const io = req.app.get("io");
    io.emit("offreDeleted", offre._id);

    res.status(200).json({ message: "Offre deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
