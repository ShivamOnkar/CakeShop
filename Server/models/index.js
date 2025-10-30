const mongoose = require('mongoose');

// Import all models
require('./User');
require('./Product');
require('./Order');

module.exports = {
  User: mongoose.model('User'),
  Product: mongoose.model('Product'),
  Order: mongoose.model('Order')
};