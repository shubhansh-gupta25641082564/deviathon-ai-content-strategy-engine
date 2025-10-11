const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'premium', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Subscription and billing
  subscription: {
    type: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  
  // Usage tracking
  usage: {
    contentAnalyses: {
      type: Number,
      default: 0
    },
    trendsSearches: {
      type: Number,
      default: 0
    },
    competitorTracking: {
      type: Number,
      default: 0
    },
    aiGenerations: {
      type: Number,
      default: 0
    },
    lastReset: {
      type: Date,
      default: Date.now
    }
  },
  
  // User preferences
  preferences: {
    defaultPlatforms: [{
      type: String,
      enum: ['YouTube', 'Reddit', 'News', 'Trends']
    }],
    industries: [String],
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      trends: {
        type: Boolean,
        default: true
      },
      competitors: {
        type: Boolean,
        default: true
      }
    }
  },
  
  // Login tracking
  loginHistory: [{
    ip: String,
    userAgent: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ createdAt: -1 });

// Middleware to hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to create password reset token
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = require('crypto').randomBytes(32).toString('hex');
  
  this.passwordResetToken = require('crypto')
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

// Instance method to check if user can perform action based on subscription
userSchema.methods.canPerformAction = function(action) {
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
      contentAnalyses: -1, // unlimited
      trendsSearches: -1,
      competitorTracking: -1,
      aiGenerations: -1
    }
  };
  
  const userLimits = limits[this.subscription.type] || limits.free;
  const currentUsage = this.usage[action] || 0;
  
  return userLimits[action] === -1 || currentUsage < userLimits[action];
};

// Instance method to increment usage
userSchema.methods.incrementUsage = async function(action) {
  if (!this.usage[action]) {
    this.usage[action] = 0;
  }
  this.usage[action]++;
  await this.save();
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

// Transform output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  delete userObject.emailVerificationToken;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);