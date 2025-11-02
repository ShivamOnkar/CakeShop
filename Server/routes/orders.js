const express = require('express');
const  router = express.Router();

const {
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrderStats
} = require('../controllers/orderController');
const { protect, restrictToAdmin } = require('../middleware/auth');

// All routes are protected and admin only
router.get('/', protect, restrictToAdmin, getOrders);
router.get('/', protect, restrictToAdmin, getOrders);
router.get('/stats/summary', protect, restrictToAdmin, getOrderStats);
router.get('/:id', protect, restrictToAdmin, getOrderById);
router.put('/:id', protect, restrictToAdmin, updateOrderStatus);
router.delete('/:id', protect, restrictToAdmin, deleteOrder);

module.exports = router;