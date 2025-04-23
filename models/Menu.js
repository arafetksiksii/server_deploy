const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
});

const menuSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: String, // ✅ Add this
  items: [itemSchema],
}, { timestamps: true });


module.exports = mongoose.model("Menu", menuSchema);
