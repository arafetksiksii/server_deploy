const mongoose = require("mongoose");

const evenementSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  image: { type: String, default: "" } // Cloudinary URL ou local path
}, { timestamps: true });

module.exports = mongoose.model("Evenement", evenementSchema);
