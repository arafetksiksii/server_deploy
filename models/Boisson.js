const mongoose = require("mongoose");

const boissonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CategoryBoisson",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Boisson", boissonSchema);
