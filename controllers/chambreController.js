const Chambre = require("../models/Chambre");

exports.createChambre = async (req, res) => {
  try {
    const { name, description, reservable, numero, type, capacite, prix } = req.body;
    const image = req.file ? req.file.path : "";

    const chambre = new Chambre({
      name,
      description,
      image,
      numero,
      type,
      capacite: capacite ? parseInt(capacite) : 2,
      prix: prix ? parseFloat(prix) : 0,
      reservable: reservable !== undefined ? reservable : true,
    });
    await chambre.save();

    const io = req.app.get("io");
    io.emit("chambreCreated", chambre);

    res.status(201).json(chambre);
  } catch (err) {
    console.error("❌ Error creating Chambre:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.getAllChambres = async (req, res) => {
  try {
    const chambres = await Chambre.find().populate("menus");
    res.status(200).json(chambres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getChambreById = async (req, res) => {
  try {
    const chambre = await Chambre.findById(req.params.id).populate("menus");
    if (!chambre) return res.status(404).json({ message: "Chambre not found" });
    res.status(200).json(chambre);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateChambre = async (req, res) => {
  try {
    const { name, description, reservable, numero, type, capacite, prix } = req.body;
    const updateFields = { name, description };

    if (req.file) updateFields.image = req.file.path;
    if (reservable !== undefined) updateFields.reservable = reservable;
    if (numero !== undefined) updateFields.numero = numero;
    if (type !== undefined) updateFields.type = type;
    if (capacite !== undefined) updateFields.capacite = parseInt(capacite);
    if (prix !== undefined) updateFields.prix = parseFloat(prix);

    const chambre = await Chambre.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!chambre) return res.status(404).json({ message: "Chambre not found" });

    const io = req.app.get("io");
    io.emit("chambreUpdated", chambre);

    res.status(200).json(chambre);
  } catch (err) {
    console.error("❌ Error updating Chambre:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteChambre = async (req, res) => {
  try {
    const chambre = await Chambre.findByIdAndDelete(req.params.id);
    if (!chambre) return res.status(404).json({ message: "Chambre not found" });

    const io = req.app.get("io");
    io.emit("chambreDeleted", chambre._id);

    res.status(200).json({ message: "Chambre deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addMenuToChambre = async (req, res) => {
  try {
    const { menuId } = req.body;

    const chambre = await Chambre.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { menus: menuId } },
      { new: true }
    ).populate("menus");

    if (!chambre) return res.status(404).json({ message: "Chambre not found" });

    res.status(200).json(chambre);
  } catch (err) {
    console.error("❌ Error adding menu to Chambre:", err.message);
    res.status(500).json({ message: err.message });
  }
};
