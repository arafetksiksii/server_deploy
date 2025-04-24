const Event = require("../models/Event");

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, price, participants } = req.body;
    const image = req.file ? req.file.path : ""; // 🌩️ Cloudinary provides full image URL

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

    res.status(201).json(event);
  } catch (err) {
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
      updateFields.image = req.file.path; // ✅ Use Cloudinary's image URL
    }

    const event = await Event.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    if (!event) return res.status(404).json({ message: "Event not found" });

    const io = req.app.get("io");
    io.emit("eventUpdated", event);

    res.status(200).json(event);
  } catch (err) {
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
