const mongoose = require('mongoose');

const competitorSchema = new mongoose.Schema({
  // User who is tracking this competitor
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Basic competitor information
  name: {
    type: String,
    required: true,
    trim: true
  },
  handle: {
    type: String,
    required: true,
    trim: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['YouTube', 'Instagram', 'TikTok', 'Twitter', 'Facebook', 'LinkedIn', 'Website', 'Other']
  },
  url: String,
  avatar: String,
  description: String,
  
  // Category and industry
  category: {
    type: String,
    enum: ['Technology', 'Gaming', 'Food & Cooking', 'Fitness', 'Business', 'Education', 'Entertainment', 'Lifestyle', 'Other'],
    default: 'Other'
  },
  industry: [String],
  tags: [String],
  
  // Current metrics
  currentMetrics: {
    followers: {
      count: Number,
      lastUpdated: Date
    },
    following: {
      count: Number,
      lastUpdated: Date
    },
    totalPosts: {
      count: Number,
      lastUpdated: Date
    },
    engagementRate: {
      value: Number,
      lastUpdated: Date
    },
    averageLikes: {
      value: Number,
      lastUpdated: Date
    },
    averageComments: {
      value: Number,
      lastUpdated: Date
    },
    averageShares: {
      value: Number,
      lastUpdated: Date
    },
    averageViews: {
      value: Number,
      lastUpdated: Date
    },
    postingFrequency: {
      postsPerDay: Number,
      postsPerWeek: Number,
      lastUpdated: Date
    }
  },
  
  // Historical data tracking
  historicalData: [{
    date: {
      type: Date,
      default: Date.now
    },
    followers: Number,
    following: Number,
    totalPosts: Number,
    engagementRate: Number,
    averageLikes: Number,
    averageComments: Number,
    averageShares: Number,
    averageViews: Number,
    postsInPeriod: Number,
    topPerformingPost: {
      title: String,
      url: String,
      likes: Number,
      comments: Number,
      shares: Number,
      views: Number,
      postedAt: Date
    }
  }],
  
  // Content analysis
  contentAnalysis: {
    topHashtags: [{
      hashtag: String,
      frequency: Number,
      engagementScore: Number
    }],
    topKeywords: [{
      keyword: String,
      frequency: Number,
      context: String
    }],
    contentTypes: [{
      type: String, // video, image, text, carousel, etc.
      frequency: Number,
      averageEngagement: Number
    }],
    postingTimes: [{
      hour: Number,
      dayOfWeek: Number,
      averageEngagement: Number,
      postCount: Number
    }],
    toneAnalysis: {
      sentiment: {
        positive: Number,
        negative: Number,
        neutral: Number
      },
      emotion: {
        joy: Number,
        anger: Number,
        fear: Number,
        sadness: Number,
        surprise: Number
      }
    }
  },
  
  // Recent content tracking
  recentContent: [{
    title: String,
    content: String,
    url: String,
    postType: String,
    postedAt: Date,
    metrics: {
      likes: Number,
      comments: Number,
      shares: Number,
      views: Number,
      engagementRate: Number
    },
    hashtags: [String],
    mentions: [String],
    isSponsored: Boolean,
    mediaType: String // image, video, carousel, text
  }],
  
  // Performance insights
  performance: {
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    trend: {
      type: String,
      enum: ['rising', 'declining', 'stable'],
      default: 'stable'
    },
    growthRate: {
      followers: Number, // percentage
      engagement: Number,
      content: Number
    },
    strengths: [String],
    weaknesses: [String],
    opportunities: [String],
    threats: [String]
  },
  
  // Competitive insights
  competitiveInsights: {
    marketPosition: {
      type: String,
      enum: ['leader', 'challenger', 'follower', 'niche'],
      default: 'follower'
    },
    uniqueSellingPoints: [String],
    contentGaps: [String], // Opportunities based on what they're not covering
    collaborations: [{
      partner: String,
      type: String, // brand, influencer, creator
      frequency: Number
    }],
    campaigns: [{
      name: String,
      startDate: Date,
      endDate: Date,
      performance: Number,
      description: String
    }]
  },
  
  // Monitoring settings
  monitoring: {
    isActive: {
      type: Boolean,
      default: true
    },
    frequency: {
      type: String,
      enum: ['hourly', 'daily', 'weekly'],
      default: 'daily'
    },
    alerts: {
      significantGrowth: {
        enabled: Boolean,
        threshold: Number // percentage
      },
      newContent: {
        enabled: Boolean,
        viral: Boolean // alert only for viral content
      },
      engagement: {
        enabled: Boolean,
        threshold: Number
      }
    },
    lastChecked: Date,
    nextCheck: Date
  },
  
  // User notes and strategies
  userNotes: [{
    note: String,
    category: {
      type: String,
      enum: ['observation', 'strategy', 'idea', 'warning', 'opportunity']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Tracking metadata
  trackingStarted: {
    type: Date,
    default: Date.now
  },
  lastAnalyzed: Date,
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
competitorSchema.index({ user: 1, platform: 1 });
competitorSchema.index({ handle: 1, platform: 1 });
competitorSchema.index({ category: 1 });
competitorSchema.index({ 'performance.overallScore': -1 });
competitorSchema.index({ 'monitoring.isActive': 1, 'monitoring.nextCheck': 1 });
competitorSchema.index({ createdAt: -1 });

// Update updatedAt before saving
competitorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for growth trend
competitorSchema.virtual('growthTrend').get(function() {
  if (this.historicalData.length < 2) return 'insufficient-data';
  
  const recent = this.historicalData[this.historicalData.length - 1];
  const previous = this.historicalData[this.historicalData.length - 2];
  
  if (!recent || !previous) return 'insufficient-data';
  
  const followerGrowth = ((recent.followers - previous.followers) / previous.followers) * 100;
  
  if (followerGrowth > 5) return 'rapid-growth';
  if (followerGrowth > 1) return 'steady-growth';
  if (followerGrowth > -1) return 'stable';
  if (followerGrowth > -5) return 'slow-decline';
  return 'rapid-decline';
});

// Instance method to calculate engagement rate
competitorSchema.methods.calculateEngagementRate = function() {
  if (!this.currentMetrics.followers?.count) return 0;
  
  const avgLikes = this.currentMetrics.averageLikes?.value || 0;
  const avgComments = this.currentMetrics.averageComments?.value || 0;
  const followers = this.currentMetrics.followers.count;
  
  return ((avgLikes + avgComments) / followers) * 100;
};

// Instance method to get recent performance
competitorSchema.methods.getRecentPerformance = function(days = 30) {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  return this.recentContent.filter(content => 
    content.postedAt >= cutoffDate
  ).sort((a, b) => b.metrics.engagementRate - a.metrics.engagementRate);
};

// Instance method to get content insights
competitorSchema.methods.getContentInsights = function() {
  const insights = {
    bestPerformingType: null,
    bestPostingTime: null,
    topHashtags: this.contentAnalysis.topHashtags.slice(0, 5),
    averageEngagement: 0,
    contentTypeDistribution: {}
  };
  
  // Find best performing content type
  if (this.contentAnalysis.contentTypes.length > 0) {
    insights.bestPerformingType = this.contentAnalysis.contentTypes
      .sort((a, b) => b.averageEngagement - a.averageEngagement)[0];
  }
  
  // Find best posting time
  if (this.contentAnalysis.postingTimes.length > 0) {
    insights.bestPostingTime = this.contentAnalysis.postingTimes
      .sort((a, b) => b.averageEngagement - a.averageEngagement)[0];
  }
  
  return insights;
};

// Static method to get user's competitor overview
competitorSchema.statics.getUserOverview = async function(userId) {
  const overview = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId), 'monitoring.isActive': true } },
    {
      $group: {
        _id: null,
        totalCompetitors: { $sum: 1 },
        platformDistribution: {
          $push: '$platform'
        },
        averageScore: { $avg: '$performance.overallScore' },
        topPerformer: {
          $max: {
            score: '$performance.overallScore',
            name: '$name',
            handle: '$handle'
          }
        }
      }
    }
  ]);
  
  return overview[0] || {};
};

// Static method to get trending competitors
competitorSchema.statics.getTrendingCompetitors = async function(platform, category, limit = 10) {
  const query = {
    'monitoring.isActive': true,
    'performance.trend': 'rising'
  };
  
  if (platform && platform !== 'All') query.platform = platform;
  if (category && category !== 'All') query.category = category;
  
  return this.find(query)
    .sort({ 'performance.overallScore': -1, 'performance.growthRate.followers': -1 })
    .limit(limit)
    .select('name handle platform category performance currentMetrics');
};

module.exports = mongoose.model('Competitor', competitorSchema);