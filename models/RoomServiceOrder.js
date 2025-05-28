const mongoose = require("mongoose");

const roomServiceOrderSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  room: { type: String, required: true, trim: true },
  service: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending"
  },
  serviceDetails: { type: String, required: true, trim: true },
  time: { type: String, trim: true, default: null } // optional and can be null
}, { timestamps: true });

module.exports = mongoose.model("RoomServiceOrder", roomServiceOrderSchema);
