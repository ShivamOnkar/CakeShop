// Server/controllers/userController.js
const User = require('../models/User');
const Order = require('../models/Order');

// -----------------------------------------------------
// @desc    Get all users (with filters & pagination)
// @route   GET /api/users
// @access  Private/Admin
// -----------------------------------------------------
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, status } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (role && role !== 'all') query.role = role;
    if (status && status !== 'all') query.status = status;

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const usersWithCounts = await Promise.all(
      users.map(async (user) => {
        const orders = await Order.find({ user: user._id }).select('totalAmount');
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        return { ...user.toObject(), totalOrders, totalSpent };
      })
    );

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      count: usersWithCounts.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
      users: usersWithCounts,
    });
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching users' });
  }
};

// -----------------------------------------------------
// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
// -----------------------------------------------------
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const orders = await Order.find({ user: user._id }).select('totalAmount');
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    res.json({ success: true, user: { ...user.toObject(), totalOrders, totalSpent } });
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching user' });
  }
};

// -----------------------------------------------------
// @desc    Update user details (not password)
// @route   PUT /api/users/:id
// @access  Private/Admin
// -----------------------------------------------------
const updateUser = async (req, res) => {
  try {
    const { password, addresses, ...updateData } = req.body;

    if (password) {
      return res.status(400).json({
        success: false,
        message: 'Use change password route to update password',
      });
    }

    // Prevent invalid or empty address validation errors
    if (addresses && Array.isArray(addresses)) {
      updateData.addresses = addresses.filter(
        (addr) => addr && addr.name && addr.address && addr.pincode && addr.phone
      );
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, message: 'User updated successfully', user });
  } catch (error) {
    console.error('❌ Error updating user:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map((val) => val.message).join(', '),
      });
    }
    res.status(500).json({ success: false, message: 'Server error while updating user' });
  }
};

// -----------------------------------------------------
// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
// -----------------------------------------------------
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await Order.deleteMany({ user: req.params.id });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting user' });
  }
};

// -----------------------------------------------------
// @desc    Get user statistics summary
// @route   GET /api/users/stats/summary
// @access  Private/Admin
// -----------------------------------------------------
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const customerUsers = await User.countDocuments({ role: 'customer' });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    const monthlyStats = await User.aggregate([
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 },
    ]);

    res.json({
      success: true,
      stats: { totalUsers, activeUsers, adminUsers, customerUsers, newUsers, monthlyStats },
    });
  } catch (error) {
    console.error('❌ Error fetching user stats:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching statistics' });
  }
};

// -----------------------------------------------------
// @desc    Create a new user
// @route   POST /api/users
// @access  Private/Admin
// -----------------------------------------------------
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, status, phone } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Name, Email, and Password are required' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: 'User with this email already exists' });

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
      status: status || 'active',
      phone: phone || '',
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('❌ Error creating user:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map((val) => val.message).join(', '),
      });
    }
    res.status(500).json({ success: false, message: 'Server error while creating user' });
  }
};

// -----------------------------------------------------
// @desc    Get all addresses of logged-in user
// @route   GET /api/users/addresses
// @access  Private
// -----------------------------------------------------
const getUserAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('addresses');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    console.error('❌ Error fetching addresses:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching addresses' });
  }
};

// -----------------------------------------------------
// @desc    Add new address to logged-in user
// @route   POST /api/users/addresses
// @access  Private
// -----------------------------------------------------
const addUserAddress = async (req, res) => {
  try {
    const { name, phone, address, city, state, pincode, isDefault = false } = req.body;
    if (!name || !phone || !address || !city || !state || !pincode)
      return res.status(400).json({ success: false, message: 'All address fields are required' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Filter out any invalid addresses
    user.addresses = user.addresses.filter(
      (addr) => addr.name && addr.address && addr.pincode && addr.phone
    );

    if (isDefault) user.addresses.forEach((addr) => (addr.isDefault = false));

    const newAddress = {
      name,
      phone,
      address,
      city,
      state,
      pincode,
      isDefault: isDefault || user.addresses.length === 0,
    };

    user.addresses.push(newAddress);
    await user.save({ validateBeforeSave: false }); // ✅ Skip strict validation of old incomplete addresses

    res.status(201).json({ success: true, message: 'Address added successfully', addresses: user.addresses });
  } catch (error) {
    console.error('❌ Error adding address:', error);
    res.status(500).json({ success: false, message: 'Server error while adding address' });
  }
};

// -----------------------------------------------------
// @desc    Update user address
// @route   PUT /api/users/addresses/:addressId
// @access  Private
// -----------------------------------------------------
const updateUserAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const updateData = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const address = user.addresses.id(addressId);
    if (!address) return res.status(404).json({ success: false, message: 'Address not found' });

    if (updateData.isDefault) user.addresses.forEach((addr) => (addr.isDefault = false));

    Object.assign(address, updateData);
    await user.save({ validateBeforeSave: false }); // ✅ Skip strict validation of all addresses

    res.json({ success: true, message: 'Address updated successfully', addresses: user.addresses });
  } catch (error) {
    console.error('❌ Error updating address:', error);
    res.status(500).json({ success: false, message: 'Server error while updating address' });
  }
};

// -----------------------------------------------------
// @desc    Delete user address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
// -----------------------------------------------------
const deleteUserAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.addresses.pull(addressId);
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, message: 'Address deleted successfully', addresses: user.addresses });
  } catch (error) {
    console.error('❌ Error deleting address:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting address' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
};
