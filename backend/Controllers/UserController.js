const { AsyncHandler } = require('../utils/AsyncHandler');
const { ApiError } = require('../utils/ApiError');
const User = require('../Models/userModel');

// Get all users (admin only)
const getUsers = AsyncHandler(async (req, res) => {
  const users = await User.find().select('-password -verificationToken -resetPasswordToken');
  
  res.status(200).json({
    success: true,
    data: {
      users,
      count: users.length
    }
  });
});

// Get user by ID
const getUserById = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const user = await User.findById(id).select('-password -verificationToken -resetPasswordToken');
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  
  res.status(200).json({
    success: true,
    data: { user }
  });
});

// Update user profile
const updateProfile = AsyncHandler(async (req, res) => {
  const { name } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name },
    { new: true, runValidators: true }
  ).select('-password -verificationToken -resetPasswordToken');
  
  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: { user }
  });
});

// Delete user (admin only)
const deleteUser = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const user = await User.findById(id);
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  
  await User.findByIdAndDelete(id);
  
  res.status(200).json({
    success: true,
    message: "User deleted successfully"
  });
});

module.exports = {
  getUsers,
  getUserById,
  updateProfile,
  deleteUser
};
