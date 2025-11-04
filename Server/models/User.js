// Server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 🏠 Address Schema
const addressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required for address'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required for address'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Address line is required'],
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
  },
  pincode: {
    type: String,
    required: [true, 'Pincode is required'],
    trim: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  }
}, { _id: true });

// 🧠 Define user schema
const userSchema = new mongoose.Schema(
  {
    // 👤 Basic Info
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },

    // ⚙️ Role & Status
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },

    // ☎️ Optional Contact Info
    phone: {
      type: String,
      trim: true,
    },

    // 🏠 Address List
    addresses: [addressSchema],

    // 🧾 Orders & Activity
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    
    // Profile image
    profileImage: {
      type: String,
      default: ''
    },

    // Preferences
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      newsletter: { type: Boolean, default: true }
    },

    // Statistics
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    lastLogin: {
      type: Date,
    },

    // Account verification
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    
    // Password reset
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

// 🔒 Hash password before saving
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

// 🎯 Clean up invalid addresses BEFORE validation
userSchema.pre('validate', function (next) {
  if (!Array.isArray(this.addresses)) {
    this.addresses = [];
  }

  if (this.isModified('addresses') && this.addresses.length > 0) {
    // Remove invalid addresses
    this.addresses = this.addresses.filter(addr => {
      return (
        addr.name &&
        addr.phone &&
        addr.address &&
        addr.city &&
        addr.state &&
        addr.pincode
      );
    });

    // Handle default address logic
    const defaultAddresses = this.addresses.filter(addr => addr.isDefault);

    if (defaultAddresses.length > 1) {
      let foundFirst = false;
      this.addresses.forEach(addr => {
        if (addr.isDefault) {
          if (!foundFirst) foundFirst = true;
          else addr.isDefault = false;
        }
      });
    }

    if (defaultAddresses.length === 0 && this.addresses.length > 0) {
      this.addresses[0].isDefault = true;
    }
  }

  next();
});

// 🔑 Compare entered password with stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🧩 Optional alias for password comparison
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🎯 Instance method to add address
userSchema.methods.addAddress = function (addressData) {
  const newAddress = {
    name: addressData.name,
    phone: addressData.phone,
    address: addressData.address,
    city: addressData.city,
    state: addressData.state,
    pincode: addressData.pincode,
    isDefault: addressData.isDefault || false
  };

  if (newAddress.isDefault) {
    this.addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }

  this.addresses.push(newAddress);
  return this.save();
};

// 🎯 Instance method to set default address
userSchema.methods.setDefaultAddress = function (addressId) {
  this.addresses.forEach(addr => {
    addr.isDefault = addr._id.toString() === addressId.toString();
  });
  return this.save();
};

// 🎯 Instance method to remove address
userSchema.methods.removeAddress = function (addressId) {
  this.addresses = this.addresses.filter(
    addr => addr._id.toString() !== addressId.toString()
  );
  return this.save();
};

// 🎯 Instance method to update address
userSchema.methods.updateAddress = function (addressId, updateData) {
  const address = this.addresses.id(addressId);
  if (!address) {
    throw new Error('Address not found');
  }

  if (updateData.isDefault) {
    this.addresses.forEach(addr => {
      if (addr._id.toString() !== addressId.toString()) {
        addr.isDefault = false;
      }
    });
  }

  Object.assign(address, updateData);
  return this.save();
};

// 🎯 Static method to get user by email
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

// 🎯 Virtual for full name
userSchema.virtual('fullName').get(function () {
  return this.name;
});

// 🎯 Transform output to include virtuals and remove sensitive data
userSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpires;
    delete ret.emailVerificationToken;
    delete ret.emailVerificationExpires;
    return ret;
  }
});

// ✅ Export User model
const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
