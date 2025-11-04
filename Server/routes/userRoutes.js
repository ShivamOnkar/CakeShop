// Server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress
} = require('../controllers/userController');
const { protect, restrictToAdmin } = require('../middleware/auth');

// -------------------- USER ADDRESS ROUTES -------------------- //
// These should come BEFORE admin routes to avoid route conflicts
router.get('/addresses', protect, getUserAddresses);
router.post('/addresses', protect, addUserAddress);
router.put('/addresses/:addressId', protect, updateUserAddress);
router.delete('/addresses/:addressId', protect, deleteUserAddress);

// -------------------- ADMIN ROUTES -------------------- //
router.get('/', protect, restrictToAdmin, getUsers);
router.get('/stats/summary', protect, restrictToAdmin, getUserStats);
router.get('/:id', protect, restrictToAdmin, getUserById);
router.post('/', protect, restrictToAdmin, createUser);
router.put('/:id', protect, restrictToAdmin, updateUser);
router.delete('/:id', protect, restrictToAdmin, deleteUser);

module.exports = router;
