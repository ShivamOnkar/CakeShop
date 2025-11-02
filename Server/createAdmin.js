// Server/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cakeshop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./models/User');

const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@cakeshop.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@cakeshop.com');
      console.log('You can use the existing admin account.');
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@cakeshop.com',
      password: 'admin123', // Will be hashed by the pre-save hook
      role: 'admin',
      isActive: true
    });

    await adminUser.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@cakeshop.com');
    console.log('🔑 Password: admin123');
    console.log('\n⚠️  Please change the password after first login!');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.connection.close();
  }
};

createAdminUser();