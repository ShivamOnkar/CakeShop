// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['bestseller', 'bakery', 'birthday', 'chocolate', 'occasion']
  },
  images: [{
    url: String,
    alt: String
  }],
  isEggless: {
    type: Boolean,
    default: false
  },
  isVegetarian: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  tags: [String],
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['g', 'kg', 'lbs'],
      default: 'kg'
    }
  },
  ingredients: [String],
  allergens: [String],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better search performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ isBestSeller: 1 });
productSchema.index({ isAvailable: 1 });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);