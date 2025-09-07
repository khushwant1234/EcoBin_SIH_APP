const express = require('express');
const { 
  loginUser, 
  registerUser, 
  // verifyEmail, 
  // resendVerificationEmail,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  getMe
} = require('../Controllers/authController');
const { protect } = require('../Middlewares/auth');

const authRouter = express.Router();

// Public endpoints
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
// Email verification routes disabled
// authRouter.get("/verify-email/:token", verifyEmail);
// authRouter.post("/resend-verification", resendVerificationEmail);

// Password reset endpoints
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);
authRouter.get("/verify-reset-token/:token", verifyResetToken);

// Protected endpoints
authRouter.get("/me", protect, getMe);

module.exports = authRouter;
