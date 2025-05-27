const mongoose = require("mongoose");

const roomServiceOrderSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  room: { type: String, required: true, trim: true },
  service: { type: String, required: true, trim: true },
  serviceDetails: { type: String, required: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model("RoomServiceOrder", roomServiceOrderSchema);
