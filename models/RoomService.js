const mongoose = require("mongoose");

const roomServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  menu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu",
    default: null // Optional field
  }
}, { timestamps: true });

module.exports = mongoose.model("RoomService", roomServiceSchema);
