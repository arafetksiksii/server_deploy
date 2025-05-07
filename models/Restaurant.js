const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
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

module.exports = mongoose.model("Restaurant", restaurantSchema);
