const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Bestseller route
app.get('/api/products/category/bestseller', async (req, res) => {
  try {
    const Product = require('./models/Product');
    const bestsellers = await Product.find({ category: 'bestseller' }).limit(8);
    res.json(bestsellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Home route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Cake Shop API is running!',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Connect to MongoDB with better error handling
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI ||process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cakeshop', 
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
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
    
    // Exit process with failure
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('❌ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.log('❌ MongoDB error:', err);
});

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌐 Visit http://localhost:${PORT} to test the API`);
});