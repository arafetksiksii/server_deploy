const Spa = require("../models/Spa");

// ✅ Create Spa (with categories)
exports.createSpa = async (req, res) => {
  try {
    const { categories, reservable } = req.body;

    if (!categories || !Array.isArray(categories)) {
      return res.status(400).json({ message: "Categories are required and must be an array" });
    }

    const spa = new Spa({ 
      categories,
      reservable: reservable !== undefined ? reservable : true
    });
    await spa.save();

    const io = req.app.get("io");
    io.emit("spaCreated", spa);

    res.status(201).json(spa);
  } catch (err) {
    console.error("❌ Error creating spa:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all Spa documents
exports.getAllSpas = async (req, res) => {
  try {
    const spas = await Spa.find();
    res.status(200).json(spas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get Spa by ID
exports.getSpaById = async (req, res) => {
  try {
    const spa = await Spa.findById(req.params.id);
    if (!spa) return res.status(404).json({ message: "Spa not found" });
    res.status(200).json(spa);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update Spa (replace categories)
exports.updateSpa = async (req, res) => {
  try {
    const { categories, reservable } = req.body;

    if (!categories || !Array.isArray(categories)) {
      return res.status(400).json({ message: "Categories are required and must be an array" });
    }

    const updateFields = { categories };
    if (reservable !== undefined) updateFields.reservable = reservable;

    const spa = await Spa.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!spa) return res.status(404).json({ message: "Spa not found" });

    const io = req.app.get("io");
    io.emit("spaUpdated", spa);

    res.status(200).json(spa);
  } catch (err) {
    console.error("❌ Error updating spa:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete Spa
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
