// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false // hide password in query results
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer'
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    phone: {
      type: String,
      trim: true
    },
    addresses: [
      {
        type: {
          type: String,
          enum: ['home', 'work', 'other'],
          default: 'home'
        },
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: {
          type: String,
          default: 'India'
        }
      }
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
      }
    ],
    totalOrders: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    lastLogin: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// ✅ Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ✅ Compare entered password with stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Optional alternative comparison method (alias)
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
