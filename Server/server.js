const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/admin'); 

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);  

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'CakeShop API is running! 🎂',
    timestamp: new Date().toISOString()
  });
});

// Admin stats endpoint
app.get('/api/admin/stats', async (req, res) => {
  try {
    const Product = require('./models/Product');
    const Order = require('./models/Order');
    const User = require('./models/User');

    const [
      totalProducts,
      totalOrders,
      totalUsers,
      pendingOrders
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Order.countDocuments({ status: 'pending' })
    ]);

    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      pendingOrders,
      totalRevenue: 0 // Simplified for now
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cakeshop';

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('✅ MongoDB connected successfully');
  console.log(`📊 Database: ${mongoose.connection.name}`);
})
.catch(err => {
  console.log('❌ MongoDB connection error:', err.message);
  console.log('💡 Make sure MongoDB is running on your system');
  console.log('💡 Try: mongod --dbpath="C:\\data\\db"');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API: http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/`);
});