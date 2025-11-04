const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    console.log('🔐 Token decoded for user ID:', decoded.id);

    // Get user from the token - DON'T use select('-password') since password is already excluded in model
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      console.log('❌ User not found for ID:', decoded.id);
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    console.log('✅ User authenticated:', req.user.email, 'Role:', req.user.role);
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error in authentication',
    });
  }
};

// Restrict route to admin users only
const restrictToAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated',
    });
  }

  if (req.user.role !== 'admin') {
    console.log('❌ Admin access denied for user:', req.user.email, 'Role:', req.user.role);
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }
  
  console.log('✅ Admin access granted for:', req.user.email);
  next();
};

module.exports = {
  protect,
  restrictToAdmin,
};