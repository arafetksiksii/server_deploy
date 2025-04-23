const Boisson = require("../models/Boisson");

exports.createBoisson = async (req, res) => {
  try {
    const { title, price, quantity, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const boisson = new Boisson({ title, price, quantity, description, image });
    await boisson.save();

    // 🔴 Emit creation
    const io = req.app.get("io");
    io.emit("boissonCreated", boisson);

    res.status(201).json(boisson);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllBoissons = async (req, res) => {
  try {
    const boissons = await Boisson.find();
    res.status(200).json(boissons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBoissonById = async (req, res) => {
  try {
    const boisson = await Boisson.findById(req.params.id);
    if (!boisson) return res.status(404).json({ message: "Boisson not found" });
    res.status(200).json(boisson);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBoisson = async (req, res) => {
  try {
    const { title, price, quantity, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const updateFields = { title, price, quantity, description };
    if (image) updateFields.image = image;

    const boisson = await Boisson.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!boisson) return res.status(404).json({ message: "Boisson not found" });

    // 🔵 Emit update
    const io = req.app.get("io");
    io.emit("boissonUpdated", boisson);

    res.status(200).json(boisson);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBoisson = async (req, res) => {
  try {
    const boisson = await Boisson.findByIdAndDelete(req.params.id);
    if (!boisson) return res.status(404).json({ message: "Boisson not found" });

    // 🟠 Emit deletion
    const io = req.app.get("io");
    io.emit("boissonDeleted", boisson._id);

    res.status(200).json({ message: "Boisson deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
