// Server/routes/userRoutes.js
const express = require('express');
const router = express.Router();

// 🧠 Import controllers
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/userController');

// 🧠 Import authentication middleware
const { protect, restrictToAdmin } = require('../middleware/auth');

// -------------------- ADMIN ROUTES -------------------- //
// ✅ Get all users (Admin only)
router.get('/', protect, restrictToAdmin, getUsers);

// ✅ Get user statistics summary (Admin only)
router.get('/stats/summary', protect, restrictToAdmin, getUserStats);

// ✅ Get user by ID (Admin only)
router.get('/:id', protect, restrictToAdmin, getUserById);

router.post('/', protect, restrictToAdmin, createUser);


// ✅ Update user details (Admin only)
router.put('/:id', protect, restrictToAdmin, updateUser);

// ✅ Delete a user (Admin only)
router.delete('/:id', protect, restrictToAdmin, deleteUser);

module.exports = router;
