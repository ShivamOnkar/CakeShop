// routes/auth.js
const express = require('express');
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  adminLogin, 
  getMe 
} = require('../controllers/authController');
const { protect, restrictToAdmin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin-login', adminLogin);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.get('/me', protect, restrictToAdmin, getMe);

module.exports = router;