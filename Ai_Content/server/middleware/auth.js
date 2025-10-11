const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided, authorization denied' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token is not valid - user not found' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Account is deactivated' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error in authentication' 
    });
  }
};

// Optional auth middleware (doesn't require token but adds user if present)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Ignore token errors in optional auth
        console.warn('Optional auth token error:', error.message);
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next(); // Continue without user
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied - no user found' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied - required role: ${roles.join(' or ')}` 
      });
    }

    next();
  };
};

// Check subscription level
const checkSubscription = (requiredLevel = 'free') => {
  const subscriptionHierarchy = {
    'free': 0,
    'basic': 1,
    'premium': 2,
    'enterprise': 3
  };

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const userLevel = subscriptionHierarchy[req.user.subscription?.type] || 0;
    const required = subscriptionHierarchy[requiredLevel] || 0;

    if (userLevel < required) {
      return res.status(403).json({ 
        success: false, 
        message: `Upgrade required - ${requiredLevel} subscription or higher needed`,
        requiredSubscription: requiredLevel,
        currentSubscription: req.user.subscription?.type || 'free'
      });
    }

    next();
  };
};

// Usage limit middleware
const checkUsageLimit = (action) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Authentication required' 
        });
      }

      // Check if user can perform this action
      if (!req.user.canPerformAction(action)) {
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

        const userLimits = limits[req.user.subscription?.type] || limits.free;
        const currentUsage = req.user.usage?.[action] || 0;
        const limit = userLimits[action];

        return res.status(429).json({ 
          success: false, 
          message: `Usage limit exceeded for ${action}`,
          currentUsage,
          limit: limit === -1 ? 'unlimited' : limit,
          subscriptionType: req.user.subscription?.type || 'free',
          upgradeRequired: true
        });
      }

      next();
    } catch (error) {
      console.error('Usage limit middleware error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error checking usage limits' 
      });
    }
  };
};

// Increment usage after successful operation
const incrementUsage = (action) => {
  return async (req, res, next) => {
    // Store the original send function
    const originalSend = res.send;
    
    // Override the send function
    res.send = function(data) {
      // Only increment on successful responses (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        req.user.incrementUsage(action).catch(error => {
          console.error('Error incrementing usage:', error);
        });
      }
      
      // Call the original send function
      originalSend.call(this, data);
    };
    
    next();
  };
};

// Validate user ownership of resource
const validateOwnership = (Model, paramKey = 'id', userField = 'user') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Authentication required' 
        });
      }

      const resourceId = req.params[paramKey];
      const resource = await Model.findById(resourceId);

      if (!resource) {
        return res.status(404).json({ 
          success: false, 
          message: 'Resource not found' 
        });
      }

      // Check ownership
      const resourceUserId = resource[userField]?.toString();
      const currentUserId = req.user._id.toString();

      if (resourceUserId !== currentUserId && req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied - you do not own this resource' 
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      console.error('Ownership validation error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error validating resource ownership' 
      });
    }
  };
};

module.exports = {
  auth,
  optionalAuth,
  authorize,
  checkSubscription,
  checkUsageLimit,
  incrementUsage,
  validateOwnership
};