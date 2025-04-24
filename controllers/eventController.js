const Event = require("../models/Event");

exports.createEvent = async (req, res) => {
  try {
    console.log("📥 Incoming createEvent request");
    console.log("🧾 req.body:", req.body);
    console.log("📸 req.file:", req.file);

    const { title, description, date, location, price, participants } = req.body;
    const image = req.file ? req.file.path : "";

    const event = new Event({
      title,
      description,
      date,
      location,
      price,
      participants,
      image,
    });

    await event.save();

    const io = req.app.get("io");
    io.emit("eventCreated", event);

    console.log("✅ Event created:", event);

    res.status(201).json(event);
  } catch (err) {
    console.error("❌ Error in createEvent:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("participants", "username email");
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("participants", "username email");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    console.log("📥 Incoming updateEvent request for ID:", req.params.id);
    console.log("🧾 req.body:", req.body);
    console.log("📸 req.file:", req.file);

    const { title, description, date, location, price, participants } = req.body;

    const updateFields = {
      title,
      description,
      date,
      location,
      price,
      participants,
    };

    if (req.file) {
      updateFields.image = req.file.path;
    }

    const event = await Event.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    if (!event) {
      console.warn("⚠️ Event not found for update:", req.params.id);
      return res.status(404).json({ message: "Event not found" });
    }

    const io = req.app.get("io");
    io.emit("eventUpdated", event);

    console.log("✅ Event updated:", event);

    res.status(200).json(event);
  } catch (err) {
    console.error("❌ Error in updateEvent:", err.message);
    res.status(500).json({ message: err.message });
  }
};



exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // 🟠 Emit deletion to clients
    const io = req.app.get("io");
    io.emit("eventDeleted", event._id);

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
