const Menu = require("../models/Menu");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.createMenu = async (req, res) => {
  try {
    const { title, items, restaurant, roomService, skyLounge } = req.body;
    const parsedItems = items ? JSON.parse(items) : [];

    // Map uploaded images to their file paths (Cloudinary returns them in .path)
    const images = req.files ? req.files.map(file => file.path) : [];

    const menu = new Menu({
      title,
      items: parsedItems,
      images,
      restaurant,
      roomService,
      skyLounge
    });
console.log("Parsed items:", parsedItems);

    await menu.save();

    const io = req.app.get("io");
    io.emit("menuCreated", menu);

    res.status(201).json(menu);
  } catch (err) {
    console.error("❌ Menu creation error:", err.message);
    res.status(500).json({ message: err.message });
  }
};


exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find().populate("restaurant", "name"); // Populate restaurant name
    res.status(200).json(menus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id).populate("restaurant", "name");
    if (!menu) return res.status(404).json({ message: "Menu not found" });
    res.status(200).json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateMenu = async (req, res) => {
  try {
    const { title, items, restaurant, roomService, skyLounge } = req.body;
    const parsedItems = items ? JSON.parse(items) : [];

    const updateFields = {
      title,
      items: parsedItems,
      restaurant,
      roomService,
      skyLounge
    };

    // If new images were uploaded, replace existing images
    if (req.files && req.files.length > 0) {
      updateFields.images = req.files.map(file => file.path);
    }

    const menu = await Menu.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!menu) return res.status(404).json({ message: "Menu not found" });

    const io = req.app.get("io");
    io.emit("menuUpdated", menu);

    res.status(200).json(menu);
  } catch (err) {
    console.error("❌ Menu update error:", err.message);
    res.status(500).json({ message: err.message });
  }
};



exports.deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    if (!menu) return res.status(404).json({ message: "Menu not found" });

    const io = req.app.get("io");
    io.emit("menuDeleted", menu._id);

    res.status(200).json({ message: "Menu deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📄 PDF generation remains unchanged
exports.downloadMenuPDF = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: "Menu not found" });

    const doc = new PDFDocument();
    const filePath = path.join(__dirname, `../pdfs/menu_${menu._id}.pdf`);

    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(20).text(menu.title, { align: "center" }).moveDown();

    menu.items.forEach(item => {
      doc
        .fontSize(14)
        .text(`${item.name} - $${item.price.toFixed(2)}`)
        .fontSize(12)
        .text(item.description)
        .moveDown();
    });

    doc.end();

    doc.on("finish", () => {
      res.download(filePath, `${menu.title}.pdf`, () => {
        fs.unlinkSync(filePath);
      });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
