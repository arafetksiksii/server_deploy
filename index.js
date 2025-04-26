const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://itbafa.com", "http://localhost:3000"],
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
  origin: ["https://itbafa.com", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

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

// Protected route example
const authenticateToken = require("./middleware/authMiddleware");
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is protected data", user: req.user });
});

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server with Socket.IO running on http://localhost:${PORT}`)
);
