// routes/userRoutes.js
const express = require('express');
const router = express.Router();

const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/userController');

const { protect, restrictToAdmin } = require('../middleware/auth');

// ✅ All routes are protected and admin-only
router.get('/', protect, restrictToAdmin, getUsers);
router.get('/stats/summary', protect, restrictToAdmin, getUserStats);
router.get('/:id', protect, restrictToAdmin, getUserById);
router.put('/:id', protect, restrictToAdmin, updateUser);
router.delete('/:id', protect, restrictToAdmin, deleteUser);

module.exports = router;
