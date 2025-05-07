const RoomService = require("../models/RoomService");

exports.createRoomService = async (req, res) => {
  try {
    const { name, description, menu } = req.body;

    const roomService = new RoomService({ name, description, menu });
    await roomService.save();

    const io = req.app.get("io");
    io.emit("roomServiceCreated", roomService);

    res.status(201).json(roomService);
  } catch (err) {
    console.error("❌ Error creating Room Service:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.getAllRoomServices = async (req, res) => {
  try {
    const services = await RoomService.find().populate("menu");
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRoomServiceById = async (req, res) => {
  try {
    const service = await RoomService.findById(req.params.id).populate("menu");
    if (!service) return res.status(404).json({ message: "Room Service not found" });
    res.status(200).json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateRoomService = async (req, res) => {
  try {
    const { name, description, menu } = req.body;

    const service = await RoomService.findByIdAndUpdate(
      req.params.id,
      { name, description, menu },
      { new: true }
    );

    if (!service) return res.status(404).json({ message: "Room Service not found" });

    const io = req.app.get("io");
    io.emit("roomServiceUpdated", service);

    res.status(200).json(service);
  } catch (err) {
    console.error("❌ Error updating Room Service:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteRoomService = async (req, res) => {
  try {
    const service = await RoomService.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: "Room Service not found" });

    const io = req.app.get("io");
    io.emit("roomServiceDeleted", service._id);

    res.status(200).json({ message: "Room Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
