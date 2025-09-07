const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../Middlewares/auth');
const {
  getUsers,
  getUserById,
  updateProfile,
  deleteUser
} = require('../Controllers/UserController');

// Protected routes - require authentication
router.use(protect);

// Get current user's profile and update it
router.patch('/profile', updateProfile);

// Admin only routes
router.get('/', restrictTo('municipality_admin'), getUsers);
router.get('/:id', restrictTo('municipality_admin'), getUserById);
router.delete('/:id', restrictTo('municipality_admin'), deleteUser);

module.exports = router;
