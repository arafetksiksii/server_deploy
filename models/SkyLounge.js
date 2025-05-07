const mongoose = require("mongoose");

const skyLoungeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  image: { type: String, default: "" }, // lien vers l’image (Cloudinary ou dossier uploads)
  menus: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu"
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("SkyLounge", skyLoungeSchema);
