const jwt = require('jsonwebtoken');
const { ApiError } = require('../utils/ApiError');
const User = require('../Models/userModel');

const protect = async (req, res, next) => {
  try {
    // Extract token from "Authorization" header formatted as "Bearer <token>"
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.headers.token) {
      token = req.headers.token;
    }

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Not authorized, token missing" 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    const currentUser = await User.findById(decoded.id).select('-password');
    
    if (!currentUser) {
      return res.status(401).json({ 
        success: false, 
        message: "User no longer exists" 
      });
    }

    // Attach user info to req.user
    req.user = currentUser;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ 
      success: false, 
      message: "Not authorized, invalid token. Kindly LOGIN AGAIN!" 
    });
  }
};

// Middleware to restrict access to specific roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };
