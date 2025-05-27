const RoomServiceOrder = require("../models/RoomServiceOrder");

exports.createRoomServiceOrder = async (req, res) => {
  try {
    const { name, room, service, serviceDetails } = req.body;

    const order = new RoomServiceOrder({ name, room, service, serviceDetails });
    await order.save();

    res.status(201).json(order);
  } catch (err) {
    console.error("❌ Error creating order:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.getAllRoomServiceOrders = async (req, res) => {
  try {
    const orders = await RoomServiceOrder.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRoomServiceOrderById = async (req, res) => {
  try {
    const order = await RoomServiceOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateRoomServiceOrder = async (req, res) => {
  try {
    const { name, room, service, serviceDetails } = req.body;

    const updatedFields = {
      name,
      room,
      service,
      serviceDetails
    };

    const order = await RoomServiceOrder.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (err) {
    console.error("❌ Error updating order:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteRoomServiceOrder = async (req, res) => {
  try {
    const order = await RoomServiceOrder.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
