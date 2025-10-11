const express = require('express');
const { body, query } = require('express-validator');
const Competitor = require('../models/Competitor');
const { auth } = require('../middleware/auth');
const { validate, asyncHandler } = require('../middleware/validation');
const { checkUsageLimit, incrementUsage } = require('../middleware/auth');
const { competitorCacheMiddleware } = require('../middleware/cache');

const router = express.Router();

// @route   POST /api/competitors
// @desc    Add a new competitor to track
// @access  Private
router.post(
  '/',
  auth,
  checkUsageLimit('competitorTracking'),
  [
    body('name')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Name must be between 1 and 100 characters'),
    body('handle')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Handle must be between 1 and 100 characters'),
    body('platform')
      .isIn(['YouTube', 'Instagram', 'TikTok', 'Twitter', 'Facebook', 'LinkedIn', 'Website', 'Other'])
      .withMessage('Invalid platform'),
    body('category')
      .optional()
      .isIn(['Technology', 'Gaming', 'Food & Cooking', 'Fitness', 'Business', 'Education', 'Entertainment', 'Lifestyle', 'Other'])
      .withMessage('Invalid category'),
    body('url')
      .optional()
      .isURL()
      .withMessage('Invalid URL'),
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters')
  ],
  validate,
  incrementUsage('competitorTracking'),
  asyncHandler(async (req, res) => {
    const { name, handle, platform, category, url, description, avatar } = req.body;

    // Check if competitor already exists for this user
    const existingCompetitor = await Competitor.findOne({
      user: req.user._id,
      handle,
      platform
    });

    if (existingCompetitor) {
      return res.status(400).json({
        success: false,
        message: 'You are already tracking this competitor'
      });
    }

    // Create competitor
    const competitor = await Competitor.create({
      user: req.user._id,
      name,
      handle,
      platform,
      category: category || 'Other',
      url,
      description,
      avatar,
      currentMetrics: {
        followers: { count: 0, lastUpdated: new Date() },
        following: { count: 0, lastUpdated: new Date() },
        totalPosts: { count: 0, lastUpdated: new Date() },
        engagementRate: { value: 0, lastUpdated: new Date() },
        averageLikes: { value: 0, lastUpdated: new Date() },
        averageComments: { value: 0, lastUpdated: new Date() },
        averageShares: { value: 0, lastUpdated: new Date() },
        averageViews: { value: 0, lastUpdated: new Date() },
        postingFrequency: { postsPerDay: 0, postsPerWeek: 0, lastUpdated: new Date() }
      },
      monitoring: {
        isActive: true,
        frequency: 'daily',
        alerts: {
          significantGrowth: { enabled: true, threshold: 10 },
          newContent: { enabled: true, viral: false },
          engagement: { enabled: true, threshold: 5 }
        },
        lastChecked: new Date(),
        nextCheck: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });

    res.status(201).json({
      success: true,
      message: 'Competitor added successfully',
      competitor: {
        id: competitor._id,
        name: competitor.name,
        handle: competitor.handle,
        platform: competitor.platform,
        category: competitor.category,
        url: competitor.url,
        description: competitor.description,
        avatar: competitor.avatar,
        trackingStarted: competitor.trackingStarted,
        monitoring: competitor.monitoring
      }
    });
  })
);

// @route   GET /api/competitors
// @desc    Get user's competitors
// @access  Private
router.get(
  '/',
  auth,
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50'),
    query('platform')
      .optional()
      .isIn(['YouTube', 'Instagram', 'TikTok', 'Twitter', 'Facebook', 'LinkedIn', 'Website', 'Other', 'All'])
      .withMessage('Invalid platform'),
    query('category')
      .optional()
      .isIn(['Technology', 'Gaming', 'Food & Cooking', 'Fitness', 'Business', 'Education', 'Entertainment', 'Lifestyle', 'Other', 'All'])
      .withMessage('Invalid category'),
    query('sortBy')
      .optional()
      .isIn(['name', 'followers', 'engagement', 'performance', 'recent'])
      .withMessage('Invalid sort field')
  ],
  validate,
  competitorCacheMiddleware,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const platform = req.query.platform;
    const category = req.query.category;
    const sortBy = req.query.sortBy || 'recent';

    const query = { 
      user: req.user._id,
      'monitoring.isActive': true
    };
    
    if (platform && platform !== 'All') {
      query.platform = platform;
    }
    
    if (category && category !== 'All') {
      query.category = category;
    }

    let sortOptions = {};
    switch (sortBy) {
      case 'name':
        sortOptions = { name: 1 };
        break;
      case 'followers':
        sortOptions = { 'currentMetrics.followers.count': -1 };
        break;
      case 'engagement':
        sortOptions = { 'currentMetrics.engagementRate.value': -1 };
        break;
      case 'performance':
        sortOptions = { 'performance.overallScore': -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const competitors = await Competitor.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('name handle platform category avatar currentMetrics performance monitoring recentContent trackingStarted');

    const total = await Competitor.countDocuments(query);

    // Generate mock data for demonstration
    const competitorsWithData = competitors.map(comp => {
      const mockData = generateMockCompetitorData(comp);
      return {
        id: comp._id,
        name: comp.name,
        handle: comp.handle,
        platform: comp.platform,
        category: comp.category,
        avatar: comp.avatar || mockData.avatar,
        currentMetrics: {
          followers: mockData.followers,
          engagementRate: mockData.engagementRate,
          postsPerDay: mockData.dailyUploads
        },
        performance: {
          overallScore: mockData.performance,
          trend: mockData.trend
        },
        recentContent: mockData.recentContent,
        trackingStarted: comp.trackingStarted,
        monitoring: comp.monitoring
      };
    });

    res.json({
      success: true,
      competitors: competitorsWithData,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  })
);

// @route   GET /api/competitors/:id
// @desc    Get detailed competitor information
// @access  Private
router.get(
  '/:id',
  auth,
  asyncHandler(async (req, res) => {
    const competitor = await Competitor.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!competitor) {
      return res.status(404).json({
        success: false,
        message: 'Competitor not found'
      });
    }

    // Generate mock detailed data
    const mockData = generateDetailedMockData(competitor);

    res.json({
      success: true,
      competitor: {
        id: competitor._id,
        name: competitor.name,
        handle: competitor.handle,
        platform: competitor.platform,
        category: competitor.category,
        url: competitor.url,
        description: competitor.description,
        avatar: competitor.avatar || mockData.avatar,
        currentMetrics: mockData.currentMetrics,
        historicalData: mockData.historicalData,
        contentAnalysis: mockData.contentAnalysis,
        recentContent: mockData.recentContent,
        performance: mockData.performance,
        competitiveInsights: mockData.competitiveInsights,
        userNotes: competitor.userNotes,
        monitoring: competitor.monitoring,
        trackingStarted: competitor.trackingStarted,
        lastAnalyzed: competitor.lastAnalyzed || new Date()
      }
    });
  })
);

// @route   PUT /api/competitors/:id
// @desc    Update competitor information
// @access  Private
router.put(
  '/:id',
  auth,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Name must be between 1 and 100 characters'),
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
    body('category')
      .optional()
      .isIn(['Technology', 'Gaming', 'Food & Cooking', 'Fitness', 'Business', 'Education', 'Entertainment', 'Lifestyle', 'Other'])
      .withMessage('Invalid category'),
    body('monitoring.frequency')
      .optional()
      .isIn(['hourly', 'daily', 'weekly'])
      .withMessage('Invalid monitoring frequency'),
    body('monitoring.alerts')
      .optional()
      .isObject()
      .withMessage('Alerts must be an object')
  ],
  validate,
  asyncHandler(async (req, res) => {
    const competitor = await Competitor.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!competitor) {
      return res.status(404).json({
        success: false,
        message: 'Competitor not found'
      });
    }

    const { name, description, category, monitoring, avatar } = req.body;

    // Update fields
    if (name !== undefined) competitor.name = name;
    if (description !== undefined) competitor.description = description;
    if (category !== undefined) competitor.category = category;
    if (avatar !== undefined) competitor.avatar = avatar;
    if (monitoring !== undefined) {
      competitor.monitoring = { ...competitor.monitoring, ...monitoring };
    }

    await competitor.save();

    res.json({
      success: true,
      message: 'Competitor updated successfully',
      competitor: {
        id: competitor._id,
        name: competitor.name,
        handle: competitor.handle,
        platform: competitor.platform,
        category: competitor.category,
        description: competitor.description,
        avatar: competitor.avatar,
        monitoring: competitor.monitoring
      }
    });
  })
);

// @route   DELETE /api/competitors/:id
// @desc    Delete/stop tracking a competitor
// @access  Private
router.delete(
  '/:id',
  auth,
  asyncHandler(async (req, res) => {
    const competitor = await Competitor.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!competitor) {
      return res.status(404).json({
        success: false,
        message: 'Competitor not found'
      });
    }

    res.json({
      success: true,
      message: 'Competitor removed from tracking'
    });
  })
);

// @route   POST /api/competitors/:id/notes
// @desc    Add a note to competitor
// @access  Private
router.post(
  '/:id/notes',
  auth,
  [
    body('note')
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Note must be between 1 and 1000 characters'),
    body('category')
      .optional()
      .isIn(['observation', 'strategy', 'idea', 'warning', 'opportunity'])
      .withMessage('Invalid note category')
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { note, category } = req.body;

    const competitor = await Competitor.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!competitor) {
      return res.status(404).json({
        success: false,
        message: 'Competitor not found'
      });
    }

    competitor.userNotes.push({
      note,
      category: category || 'observation',
      createdAt: new Date()
    });

    await competitor.save();

    res.json({
      success: true,
      message: 'Note added successfully',
      note: competitor.userNotes[competitor.userNotes.length - 1]
    });
  })
);

// @route   GET /api/competitors/analytics/overview
// @desc    Get competitors analytics overview
// @access  Private
router.get(
  '/analytics/overview',
  auth,
  asyncHandler(async (req, res) => {
    const overview = await Competitor.getUserOverview(req.user._id);
    
    // Generate mock analytics data
    const mockAnalytics = {
      totalCompetitors: overview.totalCompetitors || 0,
      platformDistribution: {
        YouTube: Math.floor(Math.random() * 5) + 1,
        Instagram: Math.floor(Math.random() * 3) + 1,
        TikTok: Math.floor(Math.random() * 2) + 1,
        Twitter: Math.floor(Math.random() * 3) + 1
      },
      averagePerformance: Math.floor(Math.random() * 30) + 70,
      topPerformer: {
        name: '@TechGuru',
        handle: '@TechGuru',
        platform: 'YouTube',
        score: 94
      },
      growthTrends: {
        rising: Math.floor(Math.random() * 3) + 1,
        stable: Math.floor(Math.random() * 2) + 1,
        declining: Math.floor(Math.random() * 1)
      },
      engagementBenchmark: {
        average: '6.8%',
        top: '12.3%',
        yourBest: '8.9%'
      },
      contentInsights: {
        mostEngagingType: 'Tutorial Videos',
        bestPostingTime: 'Tuesday 3PM',
        trendingHashtags: ['#TechTips', '#Tutorial', '#Review', '#Innovation']
      }
    };

    res.json({
      success: true,
      analytics: mockAnalytics
    });
  })
);

// @route   GET /api/competitors/trending
// @desc    Get trending competitors in category/platform
// @access  Public (with optional auth)
router.get(
  '/trending',
  [
    query('platform')
      .optional()
      .isIn(['YouTube', 'Instagram', 'TikTok', 'Twitter', 'Facebook', 'LinkedIn', 'All'])
      .withMessage('Invalid platform'),
    query('category')
      .optional()
      .isIn(['Technology', 'Gaming', 'Food & Cooking', 'Fitness', 'Business', 'Education', 'Entertainment', 'Lifestyle', 'All'])
      .withMessage('Invalid category'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 20 })
      .withMessage('Limit must be between 1 and 20')
  ],
  validate,
  asyncHandler(async (req, res) => {
    const platform = req.query.platform;
    const category = req.query.category;
    const limit = parseInt(req.query.limit) || 10;

    // Generate mock trending competitors
    const trendingCompetitors = generateMockTrendingCompetitors(platform, category, limit);

    res.json({
      success: true,
      trending: trendingCompetitors
    });
  })
);

// Helper function to generate mock competitor data
const generateMockCompetitorData = (competitor) => {
  const mockAvatars = [
    'https://randomuser.me/api/portraits/men/25.jpg',
    'https://randomuser.me/api/portraits/women/47.jpg',
    'https://randomuser.me/api/portraits/men/32.jpg',
    'https://randomuser.me/api/portraits/women/32.jpg'
  ];

  return {
    avatar: mockAvatars[Math.floor(Math.random() * mockAvatars.length)],
    followers: `${Math.floor(Math.random() * 900 + 100)}K`,
    engagementRate: `${(Math.random() * 5 + 3).toFixed(1)}%`,
    dailyUploads: Math.floor(Math.random() * 3) + 1,
    performance: Math.floor(Math.random() * 30) + 70,
    trend: Math.random() > 0.3 ? 'up' : 'down',
    recentContent: {
      title: generateMockContentTitle(competitor.category),
      views: `${Math.floor(Math.random() * 500 + 50)}K`,
      engagement: `${(Math.random() * 8 + 2).toFixed(1)}%`
    }
  };
};

// Helper function to generate detailed mock data
const generateDetailedMockData = (competitor) => {
  const mockData = generateMockCompetitorData(competitor);
  
  return {
    ...mockData,
    currentMetrics: {
      followers: { count: Math.floor(Math.random() * 900000 + 100000), lastUpdated: new Date() },
      following: { count: Math.floor(Math.random() * 1000 + 200), lastUpdated: new Date() },
      totalPosts: { count: Math.floor(Math.random() * 500 + 100), lastUpdated: new Date() },
      engagementRate: { value: Math.random() * 5 + 3, lastUpdated: new Date() },
      averageLikes: { value: Math.floor(Math.random() * 5000 + 1000), lastUpdated: new Date() },
      averageComments: { value: Math.floor(Math.random() * 200 + 50), lastUpdated: new Date() },
      averageShares: { value: Math.floor(Math.random() * 100 + 20), lastUpdated: new Date() },
      postingFrequency: { postsPerDay: mockData.dailyUploads, postsPerWeek: mockData.dailyUploads * 7 }
    },
    historicalData: generateMockHistoricalData(),
    contentAnalysis: generateMockContentAnalysis(),
    recentContent: generateMockRecentContent(competitor.category),
    performance: {
      overallScore: mockData.performance,
      trend: mockData.trend,
      growthRate: {
        followers: Math.random() * 10 + 1,
        engagement: Math.random() * 5 + 1,
        content: Math.random() * 8 + 2
      },
      strengths: generateMockStrengths(competitor.category),
      weaknesses: generateMockWeaknesses(),
      opportunities: generateMockOpportunities(),
      threats: generateMockThreats()
    },
    competitiveInsights: {
      marketPosition: ['leader', 'challenger', 'follower'][Math.floor(Math.random() * 3)],
      uniqueSellingPoints: generateMockUSPs(competitor.category),
      contentGaps: generateMockContentGaps(),
      collaborations: generateMockCollaborations()
    }
  };
};

// Helper functions for mock data generation
const generateMockContentTitle = (category) => {
  const titles = {
    'Technology': ['Latest Tech Review', 'Programming Tutorial', 'Tech News Update', 'Gadget Unboxing'],
    'Gaming': ['Epic Gaming Moments', 'Game Review', 'Gaming Tips & Tricks', 'Live Stream Highlights'],
    'Food & Cooking': ['Easy Recipe Tutorial', 'Cooking Tips', 'Restaurant Review', 'Kitchen Hacks'],
    'Fitness': ['Workout Routine', 'Fitness Tips', 'Health & Wellness', 'Exercise Tutorial'],
    'Other': ['Tutorial Video', 'Tips & Tricks', 'Review', 'How-to Guide']
  };
  
  const categoryTitles = titles[category] || titles['Other'];
  return categoryTitles[Math.floor(Math.random() * categoryTitles.length)];
};

const generateMockHistoricalData = () => {
  const data = [];
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    data.push({
      date,
      followers: Math.floor(Math.random() * 10000 + 90000 + (i * 100)),
      engagement: Math.random() * 2 + 5,
      posts: Math.floor(Math.random() * 5) + 1
    });
  }
  return data;
};

const generateMockContentAnalysis = () => ({
  topHashtags: [
    { hashtag: '#tutorial', frequency: 15, engagementScore: 8.5 },
    { hashtag: '#tips', frequency: 12, engagementScore: 7.2 },
    { hashtag: '#review', frequency: 10, engagementScore: 6.8 }
  ],
  topKeywords: [
    { keyword: 'tutorial', frequency: 25, context: 'educational' },
    { keyword: 'review', frequency: 20, context: 'analysis' },
    { keyword: 'tips', frequency: 18, context: 'advice' }
  ],
  contentTypes: [
    { type: 'video', frequency: 60, averageEngagement: 7.5 },
    { type: 'image', frequency: 30, averageEngagement: 5.2 },
    { type: 'carousel', frequency: 10, averageEngagement: 6.8 }
  ]
});

const generateMockRecentContent = (category) => {
  const content = [];
  for (let i = 0; i < 5; i++) {
    content.push({
      title: generateMockContentTitle(category),
      url: '#',
      postedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      metrics: {
        likes: Math.floor(Math.random() * 5000 + 500),
        comments: Math.floor(Math.random() * 200 + 20),
        shares: Math.floor(Math.random() * 100 + 10),
        views: Math.floor(Math.random() * 50000 + 5000),
        engagementRate: Math.random() * 5 + 3
      },
      hashtags: ['#tutorial', '#tips', '#review'].slice(0, Math.floor(Math.random() * 3) + 1)
    });
  }
  return content;
};

const generateMockStrengths = (category) => {
  const strengths = {
    'Technology': ['Strong technical knowledge', 'Clear explanations', 'Regular posting schedule'],
    'Gaming': ['Entertaining commentary', 'High-quality gameplay', 'Active community engagement'],
    'Food & Cooking': ['Creative recipes', 'Professional presentation', 'Detailed instructions'],
    'Fitness': ['Motivational content', 'Proper form demonstration', 'Variety of workouts'],
    'Other': ['Consistent quality', 'Good engagement', 'Clear communication']
  };
  
  return strengths[category] || strengths['Other'];
};

const generateMockWeaknesses = () => [
  'Limited content variety',
  'Inconsistent posting schedule',
  'Low audience interaction'
];

const generateMockOpportunities = () => [
  'Trending topic coverage',
  'Collaboration potential',
  'New platform expansion'
];

const generateMockThreats = () => [
  'Increasing competition',
  'Platform algorithm changes',
  'Audience attention shifts'
];

const generateMockUSPs = (category) => {
  const usps = {
    'Technology': ['First to review new gadgets', 'In-depth technical analysis'],
    'Gaming': ['Unique gaming style', 'Exclusive game access'],
    'Food & Cooking': ['Family recipes', 'Quick meal solutions'],
    'Fitness': ['Beginner-friendly approach', 'No equipment needed'],
    'Other': ['Unique perspective', 'High production quality']
  };
  
  return usps[category] || usps['Other'];
};

const generateMockContentGaps = () => [
  'Beginner tutorials missing',
  'Advanced topics underexplored',
  'Trend-based content lacking'
];

const generateMockCollaborations = () => [
  { partner: 'TechBrand X', type: 'brand', frequency: 2 },
  { partner: 'CreatorY', type: 'influencer', frequency: 1 }
];

const generateMockTrendingCompetitors = (platform, category, limit) => {
  const competitors = [];
  const names = ['TechGuru', 'GameMaster', 'FoodieExpert', 'FitnessCoach', 'CreativeMinds'];
  
  for (let i = 0; i < limit; i++) {
    competitors.push({
      name: names[i % names.length] + (i + 1),
      handle: '@' + names[i % names.length].toLowerCase() + (i + 1),
      platform: platform || ['YouTube', 'Instagram', 'TikTok'][Math.floor(Math.random() * 3)],
      category: category || ['Technology', 'Gaming', 'Food & Cooking'][Math.floor(Math.random() * 3)],
      followers: `${Math.floor(Math.random() * 900 + 100)}K`,
      engagementRate: `${(Math.random() * 5 + 3).toFixed(1)}%`,
      growthRate: `+${(Math.random() * 20 + 5).toFixed(1)}%`,
      performance: Math.floor(Math.random() * 30) + 70
    });
  }
  
  return competitors;
};

module.exports = router;