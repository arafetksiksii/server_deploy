const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "https://itbafa.com",
      "http://localhost:3000",
      "https://novotel-tunis.com",
      "https://www.novotel-tunis.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});


// Expose io globally so controllers can access it
app.set("io", io);

// Connect to MongoDB
connectDB();

process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 Unhandled Rejection at:", promise);
  console.error("Reason:", JSON.stringify(reason, Object.getOwnPropertyNames(reason), 2));
});

// Middleware
app.use(cors({
  origin: [
    "https://itbafa.com", 
    "http://localhost:3000", 
    "https://novotel-tunis.com", 
    "https://www.novotel-tunis.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Augmenter les limites de taille pour les requêtes JSON et URL-encoded
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Middleware pour augmenter la limite de taille de requête (pour les requêtes multipart)
app.use((req, res, next) => {
  // Augmenter la limite de taille de requête pour les uploads
  req.setTimeout(300000); // 5 minutes timeout
  res.setTimeout(300000);
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const menuRoutes = require("./routes/menuRoutes");
const boissonRoutes = require("./routes/boissonRoutes");
const offreRoutes = require("./routes/offreRoutes");
const presentationRoutes = require("./routes/presentationRoutes");
const categoryBoissonRoutes = require("./routes/categoryBoissonRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const seminaireRoutes = require("./routes/seminaireRoutes");
const spaRoutes = require("./routes/spaRoutes");
const loisirRoutes = require("./routes/loisirRoutes");
const skyLoungeRoutes = require("./routes/skyLoungeRoutes");
const terrassePiscineRoutes = require("./routes/terrassePiscineRoutes");
const chambreRoutes = require("./routes/chambreRoutes");
const evenementRoutes = require("./routes/evenementRoutes");
const roomServiceRoutes = require("./routes/roomServiceRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const userRoutes = require("./routes/userRoutes");
const analyticsRoutes = require("./analytics")
const notificationRoutes = require("./routes/notificationRoutes");
const nettoyageRoutes = require("./routes/nettoyageRoutes");
const roomServiceOrderRoutes = require("./routes/roomServiceOrderRoutes");
const pageContentRoutes = require("./routes/pageContentRoutes");
const spaCategoryRoutes = require("./routes/spaCategoryRoutes");
const questionnaireRoutes = require("./routes/questionnaireRoutes");
const skipCleanRoutes = require("./routes/skipCleanRoutes");
const questionnaireResponseRoutes = require("./routes/questionnaireResponseRoutes");
// 🔹 Middleware pour afficher les requêtes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});
app.use("/api/questionnaire-responses", questionnaireResponseRoutes);

app.use("/api/skipcleans", skipCleanRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/boissons", boissonRoutes);
app.use("/api/categories-boisson", categoryBoissonRoutes);
app.use("/api/offres", offreRoutes);
app.use("/api/presentations", presentationRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/seminaires", seminaireRoutes);
app.use("/api/spas", spaRoutes);
app.use("/api/loisirs", loisirRoutes);
app.use("/api/sky-lounges", skyLoungeRoutes);
app.use("/api/terrasses-piscine", terrassePiscineRoutes);
app.use("/api/chambres", chambreRoutes);
app.use("/api/evenements", evenementRoutes);
app.use("/api/room-services", roomServiceRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/analytics", analyticsRoutes)
app.use("/api/notifications", notificationRoutes);
app.use("/api/nettoyages", nettoyageRoutes);
app.use("/api/roomservice-orders", roomServiceOrderRoutes);
app.use("/api/page-contents", pageContentRoutes);
app.use("/api/spa-categories", spaCategoryRoutes);
app.use("/api/questionnaires", questionnaireRoutes);

// Protected route example
const authenticateToken = require("./middleware/authMiddleware");
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is protected data", user: req.user });
});
// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// Middleware de gestion d'erreur global pour les erreurs 413
app.use((err, req, res, next) => {
  // Gérer les erreurs de taille de requête
  if (err.code === 'LIMIT_FILE_SIZE' || err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_FIELD_VALUE') {
    return res.status(413).json({
      message: err.message || 'Request Entity Too Large',
      code: err.code,
      details: 'La taille totale de la requête dépasse la limite autorisée. Veuillez réduire la taille des images ou envoyer moins de fichiers.'
    });
  }
  
  // Autres erreurs
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// Start the server
app.listen(5000, "0.0.0.0", () => {
  console.log("✅ TEST SERVER running on port 5000")
})