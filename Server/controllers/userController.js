const User = require('../models/User');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        addresses: updatedUser.addresses,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Add or update user address
// @route   POST /api/users/addresses
// @access  Private
const addAddress = async (req, res) => {
  try {
    const { name, phone, address, city, state, pincode, isDefault = false } = req.body;

    // Validate required fields
    if (!name || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({ message: 'All address fields are required' });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newAddress = {
      name,
      phone,
      address,
      city,
      state,
      pincode,
      isDefault
    };

    // If this is set as default, remove default from other addresses
    if (isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    // If this is the first address, set it as default
    if (user.addresses.length === 0) {
      newAddress.isDefault = true;
    }

    user.addresses.push(newAddress);
    await user.save();

    res.json(user.addresses);
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.addresses);
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update user address
// @route   PUT /api/users/addresses/:addressId
// @access  Private
const updateUserAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.addressId);

    if (address) {
      address.name = req.body.name || address.name;
      address.address = req.body.address || address.address;
      address.city = req.body.city || address.city;
      address.state = req.body.state || address.state;
      address.pincode = req.body.pincode || address.pincode;
      address.phone = req.body.phone || address.phone;

      // Handle default address change
      if (req.body.isDefault && !address.isDefault) {
        user.addresses.forEach(addr => {
          addr.isDefault = false;
        });
        address.isDefault = true;
      }

      await user.save();
      res.json(user.addresses);
    } else {
      res.status(404).json({ message: 'Address not found' });
    }
  } catch (error) {
    console.error('Update address error:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete user address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
const deleteUserAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.addressId);
    
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If deleting default address, set another as default
    if (address.isDefault && user.addresses.length > 1) {
      const otherAddress = user.addresses.find(addr => addr._id.toString() !== req.params.addressId);
      if (otherAddress) {
        otherAddress.isDefault = true;
      }
    }

    user.addresses.pull({ _id: req.params.addressId });
    await user.save();
    
    res.json(user.addresses);
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  updateUserProfile,
  getAddresses,
  addAddress,
  updateUserAddress,
  deleteUserAddress,
};