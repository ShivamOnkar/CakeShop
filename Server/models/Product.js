const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
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

  // Updated image handling for multer
  image: { type: String, required: true },

  // Basic product flags
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
    required: [true, 'Product stock is required'],
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },

  // Optional fields
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

  // Flags for front display
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

// Indexes for performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ isBestSeller: 1 });
productSchema.index({ isAvailable: 1 });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
