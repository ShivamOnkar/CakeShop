// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// ✅ REGISTER USER
const registerUser = async (req, res) => {
  try {
    console.log("📩 Raw req.body type:", typeof req.body);
    console.log("📩 Incoming request body:", req.body);

    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { name, email, password, phone } = data;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'User registration failed'
    });
  }
};

// ✅ LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email and password' 
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(401).json({ 
        success: false,
        message: 'Your account has been deactivated. Please contact administrator.' 
      });
    }

    // Check password using consistent method name
    const isPasswordCorrect = await user.matchPassword(password);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ 
      success: false,
      message: error.message || 'Login failed' 
    });
  }
};

// ✅ ADMIN LOGIN
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find admin user and include password field
    const user = await User.findOne({ email, role: 'admin' }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Check if admin is active
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Admin account has been deactivated'
      });
    }

    // Use the same method name for consistency
    const isPasswordCorrect = await user.matchPassword(password);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin login',
      error: error.message
    });
  }
};

// ✅ GET CURRENT ADMIN PROFILE
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile',
      error: error.message
    });
  }
};

// ✅ GET USER PROFILE
const getUserProfile = async (req, res) => {
  try {
    // Make sure user exists in request (set by protect middleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
        totalOrders: user.totalOrders,
        totalSpent: user.totalSpent
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user profile'
    });
  }
};

// ✅ FINAL EXPORT
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  adminLogin,
  getMe
};