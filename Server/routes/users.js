const express = require('express');
const {
  updateUserProfile,
  addAddress,
  getAddresses ,
  updateUserAddress,
  deleteUserAddress,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/profile').put(protect, updateUserProfile);
router.route('/addresses')
  .get(protect, getAddresses)
  .post(protect, addAddress);

router.route('/addresses/:addressId')
  .put(protect, updateUserAddress)
  .delete(protect, deleteUserAddress);

module.exports = router;