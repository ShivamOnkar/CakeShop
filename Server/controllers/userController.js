// Server/controllers/userController.js
const User = require('../models/User');

// -----------------------------------------------------
// @desc    Get all users (with filters & pagination)
// @route   GET /api/users
// @access  Private/Admin
// -----------------------------------------------------
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, status } = req.query;
    const query = {};

    // 🔍 Search filter (name/email)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // 🧍 Role filter
    if (role && role !== 'all') query.role = role;

    // ⚙️ Status filter
    if (status && status !== 'all') query.status = status;

    // 🧮 Fetch users
 const users = await User.find(query)
  .select('-password')
  .populate('orders', '_id totalAmount')
  .limit(limit * 1)
  .skip((page - 1) * limit)
  .sort({ createdAt: -1 });

const usersWithCounts = users.map(u => ({
  ...u.toObject(),
  totalOrders: u.orders?.length || 0,
  totalSpent: u.orders?.reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 0,
}));


    const total = await User.countDocuments(query);

    res.json({
  success: true,
  count: usersWithCounts.length,
  total,
  users: usersWithCounts,
});
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users',
    });
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
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user',
    });
  }
};

// -----------------------------------------------------
// @desc    Update user details (not password)
// @route   PUT /api/users/:id
// @access  Private/Admin
// -----------------------------------------------------
const updateUser = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;

    // ❌ Prevent password change here
    if (password) {
      return res.status(400).json({
        success: false,
        message: 'Use change password route to update password',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      user,
    });
  } catch (error) {
    console.error('❌ Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user',
    });
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
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting user',
    });
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

    // 🆕 New users in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        adminUsers,
        customerUsers,
        newUsers,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user statistics',
    });
  }
};


// @desc    Create a new user
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, status, phone } = req.body;

    // 🔎 Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, Email, and Password are required',
      });
    }

    // 🔄 Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // 🆕 Create new user
    const user = await User.create({
      name,
      email,
      password, // will be hashed automatically by pre('save')
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
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating user',
    });
  }
};

// -----------------------------------------------------
// Export all functions
// -----------------------------------------------------
module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
};
