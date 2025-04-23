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
  image: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model("Boisson", boissonSchema);
