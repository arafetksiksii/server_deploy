const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
});

const menuSchema = new mongoose.Schema({
  title: { type: String, required: true },
  images: {
    type: [String], // change from a single image to an array of image paths
    default: []
  },
  items: [itemSchema],
  restaurant: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: false
  },
  roomService: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoomService",
    required: false
  },
  skyLounge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SkyLounge",
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model("Menu", menuSchema);
