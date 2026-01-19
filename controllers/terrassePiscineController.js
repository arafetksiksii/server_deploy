const TerrassePiscine = require("../models/TerrassePiscine");

exports.createTerrassePiscine = async (req, res) => {
  try {
    const { name, description, reservable } = req.body;
    const image = req.file ? req.file.path : "";

    const terrassePiscine = new TerrassePiscine({
      name,
      description,
      image,
      reservable: reservable !== undefined ? reservable : true,
    });
    await terrassePiscine.save();

    const io = req.app.get("io");
    io.emit("terrassePiscineCreated", terrassePiscine);

    res.status(201).json(terrassePiscine);
  } catch (err) {
    console.error("❌ Error creating Terrasse Piscine:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.getAllTerrassesPiscine = async (req, res) => {
  try {
    const terrassesPiscine = await TerrassePiscine.find().populate("menus");
    res.status(200).json(terrassesPiscine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTerrassePiscineById = async (req, res) => {
  try {
    const terrassePiscine = await TerrassePiscine.findById(req.params.id).populate("menus");
    if (!terrassePiscine) return res.status(404).json({ message: "Terrasse Piscine not found" });
    res.status(200).json(terrassePiscine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTerrassePiscine = async (req, res) => {
  try {
    const { name, description, reservable } = req.body;
    const updateFields = { name, description };

    if (req.file) updateFields.image = req.file.path;
    if (reservable !== undefined) updateFields.reservable = reservable;

    const terrassePiscine = await TerrassePiscine.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );
    if (!terrassePiscine) return res.status(404).json({ message: "Terrasse Piscine not found" });

    const io = req.app.get("io");
    io.emit("terrassePiscineUpdated", terrassePiscine);

    res.status(200).json(terrassePiscine);
  } catch (err) {
    console.error("❌ Error updating Terrasse Piscine:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTerrassePiscine = async (req, res) => {
  try {
    const terrassePiscine = await TerrassePiscine.findByIdAndDelete(req.params.id);
    if (!terrassePiscine) return res.status(404).json({ message: "Terrasse Piscine not found" });

    const io = req.app.get("io");
    io.emit("terrassePiscineDeleted", terrassePiscine._id);

    res.status(200).json({ message: "Terrasse Piscine deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addMenuToTerrassePiscine = async (req, res) => {
  try {
    const { menuId } = req.body;

    const terrassePiscine = await TerrassePiscine.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { menus: menuId } },
      { new: true }
    ).populate("menus");

    if (!terrassePiscine) return res.status(404).json({ message: "Terrasse Piscine not found" });

    res.status(200).json(terrassePiscine);
  } catch (err) {
    console.error("❌ Error adding menu to Terrasse Piscine:", err.message);
    res.status(500).json({ message: err.message });
  }
};

