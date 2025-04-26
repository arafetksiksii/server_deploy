const mongoose = require("mongoose");

const loisirSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  image: { type: String, default: "" } // Cloudinary URL
}, { timestamps: true });

module.exports = mongoose.model("Loisir", loisirSchema);
