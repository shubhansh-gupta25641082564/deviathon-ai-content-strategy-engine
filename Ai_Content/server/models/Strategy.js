const mongoose = require('mongoose');

const strategySchema = new mongoose.Schema({
  // User who created/owns this strategy
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Basic strategy information
  title: {
    type: String,
    required: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Strategy type and scope
  type: {
    type: String,
    enum: ['content-calendar', 'campaign', 'platform-specific', 'trend-based', 'competitor-response', 'brand-building'],
    required: true
  },
  
  scope: {
    platforms: [{
      type: String,
      enum: ['YouTube', 'Instagram', 'TikTok', 'Twitter', 'Facebook', 'LinkedIn', 'Blog', 'Email', 'Website']
    }],
    audience: {
      demographics: [String],
      interests: [String],
      behaviors: [String],
      painPoints: [String]
    },
    goals: [{
      metric: String, // engagement, followers, conversions, etc.
      target: Number,
      timeframe: String,
      priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
      }
    }],
    budget: {
      total: Number,
      currency: {
        type: String,
        default: 'USD'
      },
      allocation: [{
        category: String, // content creation, ads, tools, etc.
        amount: Number,
        percentage: Number
      }]
    }
  },
  
  // AI-generated content recommendations
  contentRecommendations: [{
    contentType: {
      type: String,
      enum: ['blog', 'video', 'social-post', 'story', 'reel', 'carousel', 'infographic', 'podcast', 'email', 'ad']
    },
    platform: String,
    title: String,
    description: String,
    suggestedContent: String,
    keywords: [String],
    hashtags: [String],
    
    // Timing and scheduling
    suggestedTiming: {
      dayOfWeek: Number, // 0-6 (Sunday-Saturday)
      hour: Number, // 0-23
      timezone: String
    },
    frequency: String, // daily, weekly, bi-weekly, monthly
    
    // Expected performance
    estimatedPerformance: {
      reach: Number,
      engagement: Number,
      clicks: Number,
      conversions: Number,
      confidence: {
        type: Number,
        min: 0,
        max: 100
      }
    },
    
    // Implementation details
    resources: [{
      type: String, // tool, skill, person, budget
      name: String,
      required: Boolean,
      estimated_cost: Number
    }],
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'expert'],
      default: 'medium'
    },
    timeToComplete: Number, // in hours
    
    // Status tracking
    status: {
      type: String,
      enum: ['suggested', 'planned', 'in-progress', 'completed', 'paused', 'cancelled'],
      default: 'suggested'
    },
    assignedTo: String,
    dueDate: Date,
    completedAt: Date,
    
    // Performance tracking (after implementation)
    actualPerformance: {
      reach: Number,
      engagement: Number,
      clicks: Number,
      conversions: Number,
      roi: Number
    },
    
    // User feedback
    userRating: {
      type: Number,
      min: 1,
      max: 5
    },
    userNotes: String,
    
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Content calendar integration
  contentCalendar: [{
    date: Date,
    platform: String,
    contentType: String,
    title: String,
    status: {
      type: String,
      enum: ['planned', 'created', 'scheduled', 'published', 'cancelled'],
      default: 'planned'
    },
    assignee: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    relatedTrends: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trend'
    }],
    relatedRecommendation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Strategy'
    }
  }],
  
  // Trend-based insights
  trendInsights: [{
    trend: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trend'
    },
    relevanceScore: {
      type: Number,
      min: 0,
      max: 100
    },
    actionableInsight: String,
    suggestedActions: [String],
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    expiresAt: Date
  }],
  
  // Competitor analysis integration
  competitorInsights: [{
    competitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competitor'
    },
    insight: String,
    opportunity: String,
    suggestedResponse: String,
    competitiveAdvantage: String,
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }],
  
  // Performance tracking
  performance: {
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    completionRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    goalAchievement: [{
      goalId: String,
      achieved: Number,
      target: Number,
      percentage: Number,
      status: {
        type: String,
        enum: ['on-track', 'behind', 'ahead', 'completed'],
        default: 'on-track'
      }
    }],
    metrics: {
      totalReach: Number,
      totalEngagement: Number,
      totalConversions: Number,
      totalROI: Number,
      averageEngagementRate: Number,
      topPerformingContent: {
        title: String,
        platform: String,
        metrics: {
          reach: Number,
          engagement: Number,
          conversions: Number
        }
      }
    },
    timeline: [{
      date: Date,
      milestone: String,
      achieved: Boolean,
      notes: String
    }]
  },
  
  // AI insights and optimizations
  aiInsights: {
    strengths: [String],
    weaknesses: [String],
    opportunities: [String],
    threats: [String],
    optimizationSuggestions: [String],
    confidenceScore: {
      type: Number,
      min: 0,
      max: 100
    },
    lastAnalyzed: Date,
    nextReviewDate: Date
  },
  
  // Collaboration and sharing
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'manager'],
      default: 'viewer'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  isPublic: {
    type: Boolean,
    default: false
  },
  
  tags: [String],
  
  // Version control
  version: {
    type: Number,
    default: 1
  },
  
  parentStrategy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Strategy'
  },
  
  // Lifecycle management
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed', 'archived'],
    default: 'draft'
  },
  
  startDate: Date,
  endDate: Date,
  
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
strategySchema.index({ user: 1, createdAt: -1 });
strategySchema.index({ status: 1 });
strategySchema.index({ type: 1 });
strategySchema.index({ tags: 1 });
strategySchema.index({ isPublic: 1, 'performance.overallScore': -1 });
strategySchema.index({ 'scope.platforms': 1 });

// Update updatedAt before saving
strategySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for completion percentage
strategySchema.virtual('completionPercentage').get(function() {
  if (!this.contentRecommendations || this.contentRecommendations.length === 0) return 0;
  
  const completed = this.contentRecommendations.filter(rec => rec.status === 'completed').length;
  return Math.round((completed / this.contentRecommendations.length) * 100);
});

// Virtual for active recommendations
strategySchema.virtual('activeRecommendations').get(function() {
  return this.contentRecommendations.filter(rec => 
    ['suggested', 'planned', 'in-progress'].includes(rec.status)
  );
});

// Instance method to calculate overall ROI
strategySchema.methods.calculateROI = function() {
  if (!this.scope.budget?.total || this.scope.budget.total === 0) return 0;
  
  const totalConversions = this.performance.metrics?.totalConversions || 0;
  const avgConversionValue = 50; // This should be configurable
  const totalRevenue = totalConversions * avgConversionValue;
  
  return ((totalRevenue - this.scope.budget.total) / this.scope.budget.total) * 100;
};

// Instance method to get next actions
strategySchema.methods.getNextActions = function(limit = 5) {
  const now = new Date();
  
  return this.contentRecommendations
    .filter(rec => 
      rec.status === 'planned' && 
      rec.dueDate && 
      rec.dueDate <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // Due within 7 days
    )
    .sort((a, b) => a.dueDate - b.dueDate)
    .slice(0, limit);
};

// Instance method to update performance metrics
strategySchema.methods.updatePerformanceMetrics = async function() {
  const recommendations = this.contentRecommendations.filter(rec => rec.actualPerformance);
  
  if (recommendations.length === 0) return;
  
  const metrics = {
    totalReach: 0,
    totalEngagement: 0,
    totalConversions: 0,
    totalROI: 0
  };
  
  let topPerforming = null;
  let maxEngagement = 0;
  
  recommendations.forEach(rec => {
    const perf = rec.actualPerformance;
    metrics.totalReach += perf.reach || 0;
    metrics.totalEngagement += perf.engagement || 0;
    metrics.totalConversions += perf.conversions || 0;
    metrics.totalROI += perf.roi || 0;
    
    if (perf.engagement > maxEngagement) {
      maxEngagement = perf.engagement;
      topPerforming = {
        title: rec.title,
        platform: rec.platform,
        metrics: perf
      };
    }
  });
  
  this.performance.metrics = {
    ...metrics,
    averageEngagementRate: metrics.totalEngagement / recommendations.length,
    topPerformingContent: topPerforming
  };
  
  // Calculate completion rate
  const completed = this.contentRecommendations.filter(rec => rec.status === 'completed').length;
  this.performance.completionRate = (completed / this.contentRecommendations.length) * 100;
  
  await this.save();
};

// Static method to get user strategy overview
strategySchema.statics.getUserOverview = async function(userId) {
  const overview = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalStrategies: { $sum: 1 },
        activeStrategies: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        completedStrategies: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        averageCompletion: { $avg: '$performance.completionRate' },
        totalRecommendations: {
          $sum: { $size: '$contentRecommendations' }
        }
      }
    }
  ]);
  
  return overview[0] || {};
};

// Static method to get trending strategies (public ones with high performance)
strategySchema.statics.getTrendingStrategies = async function(limit = 10) {
  return this.find({
    isPublic: true,
    status: { $in: ['active', 'completed'] },
    'performance.overallScore': { $gte: 70 }
  })
  .sort({ 'performance.overallScore': -1, updatedAt: -1 })
  .limit(limit)
  .populate('user', 'username firstName lastName')
  .select('title description type performance tags createdAt user');
};

module.exports = mongoose.model('Strategy', strategySchema);