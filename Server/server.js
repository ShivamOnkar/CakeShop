// server.js (CommonJS version)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const { fileURLToPath } = require("url");

dotenv.config();

const app = express();

// For __dirname in CommonJS, Node already provides it
// Serve uploads folder publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/admin");
const uploadRoutes = require("./routes/uploadRoutes");
const imagekitAuthRoutes = require("./routes/imagekitAuth");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/imagekit-auth", imagekitAuthRoutes);
app.use("/api/upload", uploadRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "CakeShop API is running 🎂",
    timestamp: new Date().toISOString(),
  });
});

// Admin stats endpoint
app.get("/api/admin/stats", async (req, res) => {
  try {
    const Product = require("./models/Product");
    const Order = require("./models/Order");
    const User = require("./models/User");

    const [totalProducts, totalOrders, totalUsers, pendingOrders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Order.countDocuments({ status: "pending" }),
    ]);

    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      pendingOrders,
      totalRevenue: 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Database connection
const MONGODB_URI = process.env.MONGODB_URI ;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    console.log(`📊 Database: ${mongoose.connection.name}`);
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// Start server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🖼️ Images served at: http://localhost:${PORT}/uploads/<image-name>`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} already in use. Try another one.`);
  } else {
    console.error('❌ Server error:', err);
  }
});

