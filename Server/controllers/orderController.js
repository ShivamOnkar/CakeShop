// controllers/orderController.js
const Order = require('../models/Order');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, sort = '-createdAt' } = req.query;
    
    let query = {};
    
    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Search filter
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } }
      ];
    }
    
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('products.product', 'name images price')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort);
    
    const total = await Order.countDocuments(query);
    
    res.json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        page: Number(page),
        pages: Math.ceil(total / limit)
      },
      orders
    });
    
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private/Admin
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone addresses')
      .populate('products.product', 'name images price description');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      order
    });
    
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order'
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(notes && { notes })
      },
      { new: true, runValidators: true }
    ).populate('user', 'name email phone')
     .populate('products.product', 'name images price');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Order updated successfully',
      order
    });
    
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order'
    });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting order'
    });
  }
};

// @desc    Get order statistics
// @route   GET /api/orders/stats/summary
// @access  Private/Admin
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const confirmedOrders = await Order.countDocuments({ status: 'confirmed' });
    const preparingOrders = await Order.countDocuments({ status: 'preparing' });
    const readyOrders = await Order.countDocuments({ status: 'ready' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });
    
    const revenueResult = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const totalRevenue = revenueResult[0]?.total || 0;

    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        preparingOrders,
        readyOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue
      }
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order statistics'
    });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrderStats
};