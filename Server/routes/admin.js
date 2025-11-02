const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// ===============================
// 🔹 Admin Dashboard Statistics
// ===============================
router.get('/dashboard/stats', protect, adminAuth, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    const revenueResult = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data',
    });
  }
});

// ===============================
// 🔹 Get Recent Orders
// ===============================
router.get('/orders', protect, adminAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});

// ===============================
// 🔹 Get Top-Selling Products
// ===============================
router.get('/products/top-selling', protect, adminAuth, async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ salesCount: -1 })
      .limit(5);

    res.json({ products });
  } catch (error) {
    console.error('Error fetching top-selling products:', error);
    res.status(500).json({ message: 'Server error while fetching top-selling products' });
  }
});

// ===============================
// 🔹 Get All Products
// ===============================
router.get('/products', protect, adminAuth, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// ===============================
// 🔹 Add a New Product
// ===============================
router.post('/products', protect, adminAuth, async (req, res) => {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { name, category, price, description, stock, image, isBestSeller } = body;

    if (!name || !category || !price || !description) {
      return res.status(400).json({
        message: 'Product name, category, price, and description are required',
      });
    }

    const product = new Product({
      name: name.trim(),
      category: category.trim(),
      price,
      description: description.trim(),
      stock: stock || 0,
      image: image || '',
      isBestSeller: isBestSeller || false,
    });

    await product.save();
    res.status(201).json({ message: '✅ Product added successfully', product });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: '❌ Failed to add product', error: error.message });
  }
});


// ===============================
// 🔹 Delete Product by ID
// ===============================
router.delete('/products/:id', protect, adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

// ===============================
// 🔹 Get All Registered Users
// ===============================
router.get('/users', protect, adminAuth, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

module.exports = router;
