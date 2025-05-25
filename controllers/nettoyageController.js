const Nettoyage = require("../models/Nettoyage");

exports.createNettoyage = async (req, res) => {
  try {
    const { name, room, disponibleDe, disponibleA } = req.body;

    const nettoyage = new Nettoyage({
      name,
      room,
      disponibleDe: new Date(disponibleDe),
      disponibleA: new Date(disponibleA)
    });

    await nettoyage.save();

    res.status(201).json(nettoyage);
  } catch (err) {
    console.error("❌ Error creating nettoyage:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.getAllNettoyages = async (req, res) => {
  try {
    const nettoyages = await Nettoyage.find();
    res.status(200).json(nettoyages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNettoyageById = async (req, res) => {
  try {
    const nettoyage = await Nettoyage.findById(req.params.id);
    if (!nettoyage) return res.status(404).json({ message: "Nettoyage not found" });
    res.status(200).json(nettoyage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateNettoyage = async (req, res) => {
  try {
    const { name, room, disponibleDe, disponibleA } = req.body;

    const updatedFields = {
      name,
      room,
      disponibleDe: disponibleDe ? new Date(disponibleDe) : undefined,
      disponibleA: disponibleA ? new Date(disponibleA) : undefined
    };

    const nettoyage = await Nettoyage.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
    if (!nettoyage) return res.status(404).json({ message: "Nettoyage not found" });

    res.status(200).json(nettoyage);
  } catch (err) {
    console.error("❌ Error updating nettoyage:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteNettoyage = async (req, res) => {
  try {
    const nettoyage = await Nettoyage.findByIdAndDelete(req.params.id);
    if (!nettoyage) return res.status(404).json({ message: "Nettoyage not found" });

    res.status(200).json({ message: "Nettoyage deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
