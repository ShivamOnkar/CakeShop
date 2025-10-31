const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// ✅ Middleware Configuration (must come BEFORE routes)
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Parse JSON and form data (this is what fixes your Postman error)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // ✅ Add this line

app.use('/uploads', express.static('uploads'));

// ✅ Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');

// ✅ Use routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// ✅ Test routes
app.get('/api/products/category/bestseller', async (req, res) => {
  try {
    const Product = require('./models/Product');
    const bestsellers = await Product.find({ category: 'bestseller' }).limit(8);
    res.json(bestsellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/', (req, res) => {
  res.json({
    message: 'Cake Shop API is running!',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// ✅ MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cakeshop',
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.log('❌ MongoDB connection error:', error.message);
    console.log('💡 Tips:');
    console.log('1. Make sure MongoDB is installed and running');
    console.log('2. Check your MONGODB_URI in .env file');
    console.log('3. Try: mongodb://127.0.0.1:27017/cakeshop');
    console.log('4. Or use MongoDB Atlas (cloud)');
    process.exit(1);
  }
};

// ✅ Handle MongoDB Events
mongoose.connection.on('disconnected', () => {
  console.log('❌ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.log('❌ MongoDB error:', err);
});

// ✅ Connect DB and Start Server
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Visit http://localhost:${PORT}`);
});
