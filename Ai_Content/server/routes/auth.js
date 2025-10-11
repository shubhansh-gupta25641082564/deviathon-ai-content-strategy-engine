const express = require('express');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const { validate, asyncHandler } = require('../middleware/validation');
const { auth, optionalAuth } = require('../middleware/auth');
const { invalidateUserCache } = require('../middleware/cache');

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters')
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('Username can only contain letters, numbers, underscores, and dashes'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    body('firstName')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('First name cannot exceed 50 characters'),
    body('lastName')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Last name cannot exceed 50 characters')
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { username, email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return res.status(400).json({
        success: false,
        message: `User with this ${field} already exists`
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName
    });

    // Generate token
    const token = generateToken(user._id);

    // Track login
    user.lastLogin = new Date();
    user.loginHistory.push({
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        subscription: user.subscription,
        createdAt: user.createdAt
      }
    });
  })
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please enter a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { email, password, rememberMe } = req.body;

    // Check for user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token with different expiry based on rememberMe
    const tokenExpiry = rememberMe ? '30d' : process.env.JWT_EXPIRES_IN || '7d';
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: tokenExpiry,
    });

    // Update login tracking
    user.lastLogin = new Date();
    user.loginHistory.push({
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Keep only last 10 login records
    if (user.loginHistory.length > 10) {
      user.loginHistory = user.loginHistory.slice(-10);
    }

    await user.save();

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
        subscription: user.subscription,
        usage: user.usage,
        preferences: user.preferences,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });
  })
);

// @route   POST /api/auth/logout
// @desc    Logout user (client-side mainly, but we can track it)
// @access  Private
router.post('/logout', auth, asyncHandler(async (req, res) => {
  // In a more advanced setup, you might want to blacklist the token
  // For now, we'll just send a success response
  
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}));

// @route   GET /api/auth/me
// @desc    Get current user info
// @access  Private
router.get('/me', auth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.json({
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      avatar: user.avatar,
      role: user.role,
      subscription: user.subscription,
      usage: user.usage,
      preferences: user.preferences,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    }
  });
}));

// @route   PUT /api/auth/me
// @desc    Update current user info
// @access  Private
router.put(
  '/me',
  auth,
  [
    body('firstName')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('First name cannot exceed 50 characters'),
    body('lastName')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Last name cannot exceed 50 characters'),
    body('username')
      .optional()
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters')
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('Username can only contain letters, numbers, underscores, and dashes'),
    body('preferences.defaultPlatforms')
      .optional()
      .isArray()
      .withMessage('Default platforms must be an array'),
    body('preferences.industries')
      .optional()
      .isArray()
      .withMessage('Industries must be an array'),
    body('preferences.notifications')
      .optional()
      .isObject()
      .withMessage('Notifications must be an object')
  ],
  validate,
  invalidateUserCache(req => req.user.id),
  asyncHandler(async (req, res) => {
    const { firstName, lastName, username, preferences } = req.body;
    
    const user = await User.findById(req.user.id);
    
    // Check if username is taken by another user
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username, _id: { $ne: user._id } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username is already taken'
        });
      }
    }

    // Update fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (username !== undefined) user.username = username;
    if (preferences !== undefined) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        avatar: user.avatar,
        role: user.role,
        subscription: user.subscription,
        usage: user.usage,
        preferences: user.preferences,
        isEmailVerified: user.isEmailVerified,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });
  })
);

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post(
  '/change-password',
  auth,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number')
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  })
);

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post(
  '/forgot-password',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please enter a valid email')
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email address'
      });
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save();

    // In a real application, you would send an email here
    // For now, we'll just return the token (remove this in production)
    
    res.json({
      success: true,
      message: 'Password reset instructions sent to your email',
      // Remove this in production
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    });
  })
);

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post(
  '/reset-password',
  [
    body('token')
      .notEmpty()
      .withMessage('Reset token is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { token, password } = req.body;

    // Hash the token
    const hashedToken = require('crypto')
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Set new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    // Generate new token for immediate login
    const loginToken = generateToken(user._id);

    res.json({
      success: true,
      message: 'Password reset successful',
      token: loginToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        subscription: user.subscription
      }
    });
  })
);

// @route   GET /api/auth/usage
// @desc    Get user usage statistics
// @access  Private
router.get('/usage', auth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  // Calculate limits based on subscription
  const limits = {
    free: {
      contentAnalyses: 10,
      trendsSearches: 20,
      competitorTracking: 3,
      aiGenerations: 5
    },
    basic: {
      contentAnalyses: 50,
      trendsSearches: 100,
      competitorTracking: 10,
      aiGenerations: 25
    },
    premium: {
      contentAnalyses: 200,
      trendsSearches: 500,
      competitorTracking: 50,
      aiGenerations: 100
    },
    enterprise: {
      contentAnalyses: -1,
      trendsSearches: -1,
      competitorTracking: -1,
      aiGenerations: -1
    }
  };

  const userLimits = limits[user.subscription?.type] || limits.free;
  
  res.json({
    success: true,
    usage: user.usage,
    limits: userLimits,
    subscription: user.subscription,
    resetDate: user.usage.lastReset
  });
}));

module.exports = router;