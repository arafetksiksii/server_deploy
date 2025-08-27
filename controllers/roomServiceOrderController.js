const RoomServiceOrder = require("../models/RoomServiceOrder");
const nodemailer = require("nodemailer");

// 📧 Setup Nodemailer transporter (replace with your SMTP or Gmail credentials)
const transporter = nodemailer.createTransport({
  service: "gmail", // or use: host, port, secure
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your email password or app password
  },
});

// 📧 Generate confirmation email HTML
function generateConfirmationEmail(order, confirmUrl) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
    <div style="text-align: center;">
      <img src="https://seeklogo.com/images/N/novotel-logo-7F34F44CF9-seeklogo.com.png" alt="Novotel Logo" style="width: 150px;"/>
      <h2 style="color: #003366;">Confirmation de votre commande Room Service</h2>
    </div>
    <p>Bonjour <b>${order.name}</b>,</p>
    <p>Merci d'avoir choisi le service en chambre de <b>Novotel Tunis</b>. Veuillez confirmer votre commande en cliquant sur le bouton ci-dessous :</p>
    <div style="text-align: center; margin: 20px;">
      <a href="${confirmUrl}" style="background-color: #003366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Confirmer ma commande</a>
    </div>
    <p><b>Détails de la commande :</b></p>
    <ul>
      <li>Chambre : ${order.room}</li>
      <li>Service : ${order.service}</li>
      <li>Détails : ${order.serviceDetails}</li>
      <li>Heure : ${order.time || "Non spécifiée"}</li>
      <li>Status : ${order.status}</li>
    </ul>
    <hr/>
    <h3 style="color:#003366;">Contact</h3>
    <p>📞 +216 71 832 555<br/>
    📧 <a href="mailto:H6145@accor.com">H6145@accor.com</a><br/>
    🏨 Avenue Mohamed V, Tunis, Tunisie</p>
    <p><b>Réservations :</b><br/>
    📞 +216 71 832 555<br/>
    📧 <a href="mailto:H6145@accor.com">H6145@accor.com</a></p>
  </div>
  `;
}

// ✅ Create Order + Send confirmation email
exports.createRoomServiceOrder = async (req, res) => {
  try {
    const { name, email, room, service, serviceDetails, status, time } = req.body;

    const order = new RoomServiceOrder({
      name,
      email,
      room,
      service,
      serviceDetails,
      status,
      time,
      isValidated: false,
    });
    await order.save();

    // Generate confirmation URL
    const confirmUrl = `${req.protocol}://${req.get("host")}/api/room-service-orders/confirm/${order._id}`;

    // Send confirmation email
    await transporter.sendMail({
      from: `"Novotel Tunis" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Confirmation de votre commande Room Service - Novotel Tunis",
      html: generateConfirmationEmail(order, confirmUrl),
    });

    res.status(201).json({
      message: "Commande créée avec succès. Un email de confirmation a été envoyé.",
      order,
    });
  } catch (err) {
    console.error("❌ Error creating order:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Confirm Order
exports.confirmRoomServiceOrder = async (req, res) => {
  try {
    const order = await RoomServiceOrder.findByIdAndUpdate(
      req.params.id,
      { isValidated: true },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Commande non trouvée" });

    res.send(`
      <h2>✅ Votre commande a été confirmée avec succès !</h2>
      <p>Merci d'avoir choisi Novotel Tunis.</p>
    `);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all orders
exports.getAllRoomServiceOrders = async (req, res) => {
  try {
    const orders = await RoomServiceOrder.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get order by ID
exports.getRoomServiceOrderById = async (req, res) => {
  try {
    const order = await RoomServiceOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update order
exports.updateRoomServiceOrder = async (req, res) => {
  try {
    const { name, email, room, service, serviceDetails, status, time, isValidated } = req.body;

    const updatedFields = { name, email, room, service, serviceDetails, status, time, isValidated };

    const order = await RoomServiceOrder.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (err) {
    console.error("❌ Error updating order:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete order
exports.deleteRoomServiceOrder = async (req, res) => {
  try {
    const order = await RoomServiceOrder.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
