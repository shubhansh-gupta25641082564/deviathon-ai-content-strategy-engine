const mongoose = require('mongoose');

const contentAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Content is required for analysis'],
    maxlength: [50000, 'Content cannot exceed 50,000 characters']
  },
  title: {
    type: String,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  contentType: {
    type: String,
    enum: ['blog', 'social', 'email', 'video', 'other'],
    default: 'other'
  },
  platform: {
    type: String,
    enum: ['YouTube', 'Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'Blog', 'Email', 'Other'],
    default: 'Other'
  },
  
  // Analysis Results
  analysis: {
    overallScore: {
      type: Number,
      min: 0,
      max: 100
    },
    
    // Sentiment Analysis
    sentiment: {
      score: {
        type: Number,
        min: 0,
        max: 100
      },
      label: {
        type: String,
        enum: ['Positive', 'Negative', 'Neutral']
      },
      confidence: Number
    },
    
    // Readability Analysis
    readability: {
      score: {
        type: Number,
        min: 0,
        max: 100
      },
      level: String,
      fleschScore: Number,
      gradeLevel: Number
    },
    
    // SEO Analysis
    seo: {
      score: {
        type: Number,
        min: 0,
        max: 100
      },
      keywordDensity: Number,
      metaDescription: Boolean,
      headingStructure: Boolean,
      internalLinks: Number,
      externalLinks: Number
    },
    
    // Engagement Analysis
    engagement: {
      score: {
        type: Number,
        min: 0,
        max: 100
      },
      emotionalTone: String,
      callToAction: Boolean,
      questionCount: Number,
      exclamationCount: Number
    },
    
    // Content Metrics
    metrics: {
      wordCount: Number,
      characterCount: Number,
      paragraphCount: Number,
      sentenceCount: Number,
      averageSentenceLength: Number,
      readingTime: Number, // in minutes
      complexWords: Number,
      uniqueWords: Number
    },
    
    // Extracted Keywords
    keywords: [{
      keyword: String,
      frequency: Number,
      relevance: Number,
      position: Number
    }],
    
    // AI-Generated Recommendations
    recommendations: [{
      type: {
        type: String,
        enum: ['improvement', 'optimization', 'warning', 'suggestion']
      },
      category: {
        type: String,
        enum: ['readability', 'seo', 'engagement', 'structure', 'tone']
      },
      title: String,
      description: String,
      priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
      },
      impact: String // Expected impact of implementing this recommendation
    }],
    
    // Competitive Analysis
    competitiveAnalysis: {
      similarContent: [{
        title: String,
        url: String,
        score: Number,
        platform: String
      }],
      benchmarkScore: Number,
      performancePrediction: {
        engagementPotential: Number,
        viralityScore: Number,
        shareabilityScore: Number
      }
    }
  },
  
  // Processing Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  
  processingTime: Number, // in milliseconds
  
  // User Feedback
  userFeedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String,
    helpful: Boolean
  },
  
  // Sharing and Collaboration
  isPublic: {
    type: Boolean,
    default: false
  },
  
  tags: [String],
  
  // Version Control
  version: {
    type: Number,
    default: 1
  },
  
  parentAnalysis: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ContentAnalysis'
  },
  
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
contentAnalysisSchema.index({ user: 1, createdAt: -1 });
contentAnalysisSchema.index({ 'analysis.overallScore': -1 });
contentAnalysisSchema.index({ platform: 1 });
contentAnalysisSchema.index({ contentType: 1 });
contentAnalysisSchema.index({ tags: 1 });
contentAnalysisSchema.index({ status: 1 });

// Update updatedAt before saving
contentAnalysisSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for analysis summary
contentAnalysisSchema.virtual('analysisSummary').get(function() {
  if (!this.analysis) return null;
  
  return {
    overallScore: this.analysis.overallScore,
    sentiment: this.analysis.sentiment?.label,
    readabilityLevel: this.analysis.readability?.level,
    seoScore: this.analysis.seo?.score,
    engagementScore: this.analysis.engagement?.score,
    wordCount: this.analysis.metrics?.wordCount,
    readingTime: this.analysis.metrics?.readingTime
  };
});

// Instance method to get recommendations by priority
contentAnalysisSchema.methods.getRecommendationsByPriority = function(priority) {
  if (!this.analysis?.recommendations) return [];
  
  return this.analysis.recommendations.filter(rec => rec.priority === priority);
};

// Static method to get user's analysis statistics
contentAnalysisSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalAnalyses: { $sum: 1 },
        avgOverallScore: { $avg: '$analysis.overallScore' },
        avgSentimentScore: { $avg: '$analysis.sentiment.score' },
        avgReadabilityScore: { $avg: '$analysis.readability.score' },
        avgSeoScore: { $avg: '$analysis.seo.score' },
        avgEngagementScore: { $avg: '$analysis.engagement.score' },
        totalWordCount: { $sum: '$analysis.metrics.wordCount' },
        platformDistribution: {
          $push: '$platform'
        }
      }
    }
  ]);
  
  return stats[0] || {};
};

module.exports = mongoose.model('ContentAnalysis', contentAnalysisSchema);