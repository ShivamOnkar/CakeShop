// routes/admin.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');  // ✅ make sure this import exists

// ✅ Admin dashboard stats
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

    // ✅ Wrap inside `success` and `stats`
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

// Get recent orders
router.get('/orders', protect, adminAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get top selling products
router.get('/products/top-selling', protect, adminAuth, async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ salesCount: -1 })
      .limit(5);

    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get all registered users
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
