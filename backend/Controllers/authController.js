const crypto = require('crypto');
const { AsyncHandler } = require('../utils/AsyncHandler');
const { ApiError } = require('../utils/ApiError');
const { generateJWTToken } = require('../utils/GenerateJWT');
const User = require('../Models/userModel');

// Controller to register a new user
const registerUser = AsyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    throw new ApiError(400, "Name, email, password and role are required");
  }

  // Validate role
  if (!['household', 'municipality_admin'].includes(role)) {
    throw new ApiError(400, "Role must be either 'household' or 'municipality_admin'");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const userData = { 
    name, 
    email, 
    password,
    role,
    isEmailVerified: true // Set to true by default since we're not using email verification
  };

  const newUser = await User.create(userData);
  if (!newUser) {
    throw new ApiError(500, "Failed to create User");
  }

  const jwtToken = generateJWTToken(newUser._id);

  res.status(201).json({
    success: true,
    message: "Registration successful! You can now log in.",
    data: {
      token: jwtToken,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isEmailVerified: newUser.isEmailVerified
      },
    },
  });
});

// Controller to log in a user
const loginUser = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  
  const user = await User.findOne({ email });
  
  // Check if user exists and password is correct
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }
  
  const jwtToken = generateJWTToken(user._id);

  res.status(200).json({
    success: true,
    data: { 
      token: jwtToken, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      } 
    },
  });
});

// Email verification controller
const verifyEmail = AsyncHandler(async (req, res) => {
  const { token } = req.params;
  
  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() }
  });
  
  if (!user) {
    throw new ApiError(400, "Invalid or expired verification token");
  }
  
  // Update user verification status
  user.isEmailVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  
  await user.save();
  
  res.status(200).json({
    success: true,
    message: "Email verified successfully! You can now log in."
  });
});

// Resend verification email
const resendVerificationEmail = AsyncHandler(async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  
  if (user.isEmailVerified) {
    throw new ApiError(400, "Email is already verified");
  }
  
  // Generate new verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  user.verificationToken = verificationToken;
  user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
  
  await user.save();
  
  res.status(200).json({
    success: true,
    message: "Verification email sent successfully"
  });
});

// Request password reset
const forgotPassword = AsyncHandler(async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  
  const user = await User.findOne({ email });
  
  if (!user) {
    // For security reasons, don't disclose that the user doesn't exist
    return res.status(200).json({ 
      success: true, 
      message: "If an account with that email exists, a password reset link has been sent." 
    });
  }
  
  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Hash and set the reset token
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // Token expires in 15 minutes
  
  await user.save({ validateBeforeSave: false });
  
  res.status(200).json({
    success: true,
    message: "Password reset link sent to your email"
  });
});

// Reset password with token
const resetPassword = AsyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  
  if (!token || !password) {
    throw new ApiError(400, "Token and new password are required");
  }
  
  // Hash the token to compare with stored hash
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  // Find user with matching token and valid expiration
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  });
  
  if (!user) {
    throw new ApiError(400, "Password reset token is invalid or has expired");
  }
  
  // Set new password and clear reset token fields
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  
  await user.save();
  
  // Generate new JWT token for automatic login after reset
  const jwtToken = generateJWTToken(user._id);
  
  res.status(200).json({
    success: true,
    message: "Password has been reset successfully",
    data: {
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    }
  });
});

// Verify reset token validity
const verifyResetToken = AsyncHandler(async (req, res) => {
  const { token } = req.params;
  
  if (!token) {
    throw new ApiError(400, "Token is required");
  }
  
  // Hash the token to compare with stored hash
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  // Check if token exists and is not expired
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  });
  
  if (!user) {
    throw new ApiError(400, "Password reset token is invalid or has expired");
  }
  
  res.status(200).json({
    success: true,
    message: "Token is valid",
    data: {
      email: user.email
    }
  });
});

// Get current user profile
const getMe = AsyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isEmailVerified: req.user.isEmailVerified
      }
    }
  });
});

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  getMe
};
