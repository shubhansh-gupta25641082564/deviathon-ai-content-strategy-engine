const mongoose = require('mongoose');

const trendSchema = new mongoose.Schema({
  // Basic trend information
  platform: {
    type: String,
    required: true,
    enum: ['YouTube', 'Reddit', 'News', 'Trends', 'Twitter', 'Instagram', 'TikTok']
  },
  source: {
    type: String,
    required: true // e.g., 'hacker-news', 'reddit-programming', 'google-trends'
  },
  externalId: String, // ID from the external platform
  
  // Content details
  title: {
    type: String,
    required: true,
    maxlength: [500, 'Title cannot exceed 500 characters']
  },
  content: {
    type: String,
    maxlength: [5000, 'Content cannot exceed 5000 characters']
  },
  url: String,
  hashtags: [String],
  keywords: [String],
  
  // Platform-specific data
  platformData: {
    // YouTube specific
    videoId: String,
    channelId: String,
    channelName: String,
    duration: String,
    
    // Reddit specific
    subreddit: String,
    author: String,
    upvotes: Number,
    downvotes: Number,
    commentCount: Number,
    
    // News specific
    publication: String,
    authorName: String,
    publishedDate: Date,
    category: String,
    
    // General social media
    likesCount: Number,
    sharesCount: Number,
    viewsCount: Number,
    repostsCount: Number
  },
  
  // Trend metrics
  metrics: {
    trendScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    viralityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    engagementRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    growthRate: {
      type: Number,
      default: 0 // can be negative
    },
    momentum: {
      type: String,
      enum: ['rising', 'peak', 'declining', 'stable'],
      default: 'stable'
    },
    velocity: Number, // Rate of change
    reach: Number, // Estimated reach
    influence: Number // Influence score
  },
  
  // Analysis data
  analysis: {
    sentiment: {
      score: Number,
      label: {
        type: String,
        enum: ['positive', 'negative', 'neutral']
      }
    },
    topics: [String],
    entities: [{
      name: String,
      type: String, // person, organization, location, etc.
      confidence: Number
    }],
    language: {
      type: String,
      default: 'en'
    },
    category: {
      type: String,
      enum: ['Technology', 'Business', 'Entertainment', 'Sports', 'Politics', 'Health', 'Science', 'Lifestyle', 'Other'],
      default: 'Other'
    },
    targetAudience: [String], // demographics, interests
    contentType: {
      type: String,
      enum: ['news', 'tutorial', 'entertainment', 'opinion', 'review', 'discussion', 'promotional', 'educational'],
      default: 'discussion'
    }
  },
  
  // Time-based data
  discoveredAt: {
    type: Date,
    default: Date.now
  },
  publishedAt: Date,
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  
  // Lifecycle management
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: Date, // When this trend becomes irrelevant
  
  // User interactions
  bookmarkedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    bookmarkedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Content generation data
  contentSuggestions: [{
    type: {
      type: String,
      enum: ['blog', 'video', 'social', 'email', 'infographic']
    },
    title: String,
    description: String,
    targetPlatform: String,
    estimatedEngagement: Number,
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard']
    }
  }],
  
  // Related trends and content
  relatedTrends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trend'
  }],
  
  // Quality and relevance scores
  qualityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  
  relevanceScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  
  // Metadata
  metadata: {
    fetchedBy: String, // API or scraper used
    fetchedAt: Date,
    processingTime: Number,
    version: {
      type: Number,
      default: 1
    }
  }
});

// Indexes for better query performance
trendSchema.index({ platform: 1, discoveredAt: -1 });
trendSchema.index({ 'metrics.trendScore': -1 });
trendSchema.index({ 'analysis.category': 1 });
trendSchema.index({ keywords: 1 });
trendSchema.index({ hashtags: 1 });
trendSchema.index({ publishedAt: -1 });
trendSchema.index({ isActive: 1, expiresAt: 1 });
trendSchema.index({ 'metrics.momentum': 1 });

// Compound indexes
trendSchema.index({ platform: 1, 'analysis.category': 1, 'metrics.trendScore': -1 });
trendSchema.index({ discoveredAt: -1, 'metrics.trendScore': -1 });

// TTL index for automatic cleanup of expired trends
trendSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Update lastUpdated before saving
trendSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

// Virtual for age in hours
trendSchema.virtual('ageInHours').get(function() {
  return Math.floor((Date.now() - this.discoveredAt) / (1000 * 60 * 60));
});

// Virtual for trend status
trendSchema.virtual('trendStatus').get(function() {
  const age = this.ageInHours;
  const score = this.metrics.trendScore;
  
  if (age < 2 && score > 80) return 'breaking';
  if (age < 24 && score > 60) return 'trending';
  if (age < 168 && score > 40) return 'popular'; // 1 week
  return 'cooling';
});

// Instance method to check if trend is still relevant
trendSchema.methods.isRelevant = function() {
  if (!this.isActive) return false;
  if (this.expiresAt && this.expiresAt < new Date()) return false;
  
  const ageInDays = (Date.now() - this.discoveredAt) / (1000 * 60 * 60 * 24);
  const scoreThreshold = Math.max(20, 80 - (ageInDays * 5)); // Decrease threshold over time
  
  return this.metrics.trendScore >= scoreThreshold;
};

// Instance method to calculate engagement potential
trendSchema.methods.calculateEngagementPotential = function() {
  const weights = {
    trendScore: 0.3,
    viralityScore: 0.25,
    engagementRate: 0.2,
    momentum: 0.15,
    qualityScore: 0.1
  };
  
  const momentumScores = {
    rising: 100,
    peak: 80,
    stable: 60,
    declining: 30
  };
  
  return (
    this.metrics.trendScore * weights.trendScore +
    this.metrics.viralityScore * weights.viralityScore +
    this.metrics.engagementRate * weights.engagementRate +
    momentumScores[this.metrics.momentum] * weights.momentum +
    this.qualityScore * weights.qualityScore
  );
};

// Static method to get trending topics by platform
trendSchema.statics.getTrendingByPlatform = async function(platform, limit = 10) {
  return this.find({
    platform,
    isActive: true,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ]
  })
  .sort({ 'metrics.trendScore': -1, discoveredAt: -1 })
  .limit(limit)
  .populate('relatedTrends', 'title metrics.trendScore');
};

// Static method to get trends by category
trendSchema.statics.getTrendsByCategory = async function(category, limit = 10) {
  return this.find({
    'analysis.category': category,
    isActive: true,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ]
  })
  .sort({ 'metrics.trendScore': -1, discoveredAt: -1 })
  .limit(limit);
};

// Static method to get breaking trends
trendSchema.statics.getBreakingTrends = async function(limit = 5) {
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  
  return this.find({
    discoveredAt: { $gte: twoHoursAgo },
    'metrics.trendScore': { $gte: 80 },
    isActive: true
  })
  .sort({ 'metrics.trendScore': -1, discoveredAt: -1 })
  .limit(limit);
};

module.exports = mongoose.model('Trend', trendSchema);