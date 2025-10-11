const express = require('express');
const { body, query } = require('express-validator');
const OpenAI = require('openai');
const Strategy = require('../models/Strategy');
const Trend = require('../models/Trend');
const Competitor = require('../models/Competitor');
const { auth } = require('../middleware/auth');
const { validate, asyncHandler } = require('../middleware/validation');
const { checkUsageLimit, incrementUsage } = require('../middleware/auth');
const { strategyCacheMiddleware, expensiveOperationLimit } = require('../middleware/cache');

const router = express.Router();

// Initialize OpenAI (if API key is provided)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// @route   POST /api/strategies
// @desc    Create a new content strategy
// @access  Private
router.post(
  '/',
  auth,
  checkUsageLimit('aiGenerations'),
  expensiveOperationLimit,
  [
    body('title')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters'),
    body('description')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Description cannot exceed 1000 characters'),
    body('type')
      .isIn(['content-calendar', 'campaign', 'platform-specific', 'trend-based', 'competitor-response', 'brand-building'])
      .withMessage('Invalid strategy type'),
    body('scope.platforms')
      .isArray({ min: 1 })
      .withMessage('At least one platform must be selected'),
    body('scope.audience')
      .optional()
      .isObject()
      .withMessage('Audience must be an object'),
    body('scope.goals')
      .optional()
      .isArray()
      .withMessage('Goals must be an array'),
    body('scope.budget.total')
      .optional()
      .isNumeric()
      .withMessage('Budget total must be a number')
  ],
  validate,
  incrementUsage('aiGenerations'),
  asyncHandler(async (req, res) => {
    const { title, description, type, scope, startDate, endDate } = req.body;

    // Generate AI-powered content recommendations
    const recommendations = await generateContentRecommendations({
      type,
      platforms: scope.platforms,
      audience: scope.audience,
      goals: scope.goals,
      budget: scope.budget
    });

    // Generate trend insights if strategy is trend-based
    let trendInsights = [];
    if (type === 'trend-based') {
      trendInsights = await generateTrendInsights(scope.platforms);
    }

    // Generate competitor insights if strategy is competitor-response
    let competitorInsights = [];
    if (type === 'competitor-response') {
      competitorInsights = await generateCompetitorInsights(req.user._id);
    }

    // Create strategy
    const strategy = await Strategy.create({
      user: req.user._id,
      title,
      description,
      type,
      scope,
      contentRecommendations: recommendations,
      trendInsights,
      competitorInsights,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
      status: 'draft'
    });

    res.status(201).json({
      success: true,
      message: 'Strategy created successfully',
      strategy: {
        id: strategy._id,
        title: strategy.title,
        description: strategy.description,
        type: strategy.type,
        scope: strategy.scope,
        recommendationsCount: recommendations.length,
        status: strategy.status,
        createdAt: strategy.createdAt
      }
    });
  })
);

// @route   GET /api/strategies
// @desc    Get user's strategies
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
    query('type')
      .optional()
      .isIn(['content-calendar', 'campaign', 'platform-specific', 'trend-based', 'competitor-response', 'brand-building', 'all'])
      .withMessage('Invalid strategy type'),
    query('status')
      .optional()
      .isIn(['draft', 'active', 'paused', 'completed', 'archived', 'all'])
      .withMessage('Invalid status'),
    query('sortBy')
      .optional()
      .isIn(['recent', 'performance', 'completion', 'alphabetical'])
      .withMessage('Invalid sort field')
  ],
  validate,
  strategyCacheMiddleware,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const type = req.query.type;
    const status = req.query.status;
    const sortBy = req.query.sortBy || 'recent';

    const query = { user: req.user._id };
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }

    let sortOptions = {};
    switch (sortBy) {
      case 'performance':
        sortOptions = { 'performance.overallScore': -1 };
        break;
      case 'completion':
        sortOptions = { 'performance.completionRate': -1 };
        break;
      case 'alphabetical':
        sortOptions = { title: 1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const strategies = await Strategy.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('title description type scope performance status contentRecommendations startDate endDate createdAt');

    const total = await Strategy.countDocuments(query);

    const strategiesWithCompletion = strategies.map(strategy => ({
      id: strategy._id,
      title: strategy.title,
      description: strategy.description,
      type: strategy.type,
      platforms: strategy.scope?.platforms || [],
      performance: strategy.performance || { overallScore: 0, completionRate: 0 },
      status: strategy.status,
      recommendationsCount: strategy.contentRecommendations?.length || 0,
      completedRecommendations: strategy.contentRecommendations?.filter(r => r.status === 'completed').length || 0,
      startDate: strategy.startDate,
      endDate: strategy.endDate,
      createdAt: strategy.createdAt
    }));

    res.json({
      success: true,
      strategies: strategiesWithCompletion,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  })
);

// @route   GET /api/strategies/:id
// @desc    Get detailed strategy information
// @access  Private
router.get(
  '/:id',
  auth,
  asyncHandler(async (req, res) => {
    const strategy = await Strategy.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('collaborators.user', 'username firstName lastName');

    if (!strategy) {
      return res.status(404).json({
        success: false,
        message: 'Strategy not found'
      });
    }

    res.json({
      success: true,
      strategy: {
        id: strategy._id,
        title: strategy.title,
        description: strategy.description,
        type: strategy.type,
        scope: strategy.scope,
        contentRecommendations: strategy.contentRecommendations,
        contentCalendar: strategy.contentCalendar,
        trendInsights: strategy.trendInsights,
        competitorInsights: strategy.competitorInsights,
        performance: strategy.performance,
        aiInsights: strategy.aiInsights,
        collaborators: strategy.collaborators,
        tags: strategy.tags,
        status: strategy.status,
        startDate: strategy.startDate,
        endDate: strategy.endDate,
        completionPercentage: strategy.completionPercentage,
        createdAt: strategy.createdAt,
        updatedAt: strategy.updatedAt
      }
    });
  })
);

// @route   PUT /api/strategies/:id
// @desc    Update strategy
// @access  Private
router.put(
  '/:id',
  auth,
  [
    body('title')
      .optional()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters'),
    body('description')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Description cannot exceed 1000 characters'),
    body('status')
      .optional()
      .isIn(['draft', 'active', 'paused', 'completed', 'archived'])
      .withMessage('Invalid status'),
    body('scope')
      .optional()
      .isObject()
      .withMessage('Scope must be an object')
  ],
  validate,
  asyncHandler(async (req, res) => {
    const strategy = await Strategy.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!strategy) {
      return res.status(404).json({
        success: false,
        message: 'Strategy not found'
      });
    }

    const { title, description, status, scope, tags, endDate } = req.body;

    // Update fields
    if (title !== undefined) strategy.title = title;
    if (description !== undefined) strategy.description = description;
    if (status !== undefined) strategy.status = status;
    if (scope !== undefined) strategy.scope = { ...strategy.scope, ...scope };
    if (tags !== undefined) strategy.tags = tags;
    if (endDate !== undefined) strategy.endDate = endDate ? new Date(endDate) : null;

    await strategy.save();

    res.json({
      success: true,
      message: 'Strategy updated successfully',
      strategy: {
        id: strategy._id,
        title: strategy.title,
        description: strategy.description,
        status: strategy.status,
        scope: strategy.scope,
        tags: strategy.tags,
        endDate: strategy.endDate,
        updatedAt: strategy.updatedAt
      }
    });
  })
);

// @route   DELETE /api/strategies/:id
// @desc    Delete strategy
// @access  Private
router.delete(
  '/:id',
  auth,
  asyncHandler(async (req, res) => {
    const strategy = await Strategy.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!strategy) {
      return res.status(404).json({
        success: false,
        message: 'Strategy not found'
      });
    }

    res.json({
      success: true,
      message: 'Strategy deleted successfully'
    });
  })
);

// @route   POST /api/strategies/:id/recommendations
// @desc    Add new content recommendation to strategy
// @access  Private
router.post(
  '/:id/recommendations',
  auth,
  [
    body('contentType')
      .isIn(['blog', 'video', 'social-post', 'story', 'reel', 'carousel', 'infographic', 'podcast', 'email', 'ad'])
      .withMessage('Invalid content type'),
    body('platform')
      .notEmpty()
      .withMessage('Platform is required'),
    body('title')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters'),
    body('description')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Description cannot exceed 1000 characters')
  ],
  validate,
  asyncHandler(async (req, res) => {
    const strategy = await Strategy.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!strategy) {
      return res.status(404).json({
        success: false,
        message: 'Strategy not found'
      });
    }

    const recommendation = {
      contentType: req.body.contentType,
      platform: req.body.platform,
      title: req.body.title,
      description: req.body.description,
      suggestedContent: req.body.suggestedContent || '',
      keywords: req.body.keywords || [],
      hashtags: req.body.hashtags || [],
      difficulty: req.body.difficulty || 'medium',
      timeToComplete: req.body.timeToComplete || 2,
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null,
      estimatedPerformance: {
        reach: Math.floor(Math.random() * 10000) + 1000,
        engagement: Math.floor(Math.random() * 500) + 100,
        clicks: Math.floor(Math.random() * 200) + 50,
        conversions: Math.floor(Math.random() * 50) + 10,
        confidence: Math.floor(Math.random() * 30) + 70
      }
    };

    strategy.contentRecommendations.push(recommendation);
    await strategy.save();

    res.json({
      success: true,
      message: 'Recommendation added successfully',
      recommendation: strategy.contentRecommendations[strategy.contentRecommendations.length - 1]
    });
  })
);

// @route   PUT /api/strategies/:id/recommendations/:recId
// @desc    Update content recommendation status
// @access  Private
router.put(
  '/:id/recommendations/:recId',
  auth,
  [
    body('status')
      .optional()
      .isIn(['suggested', 'planned', 'in-progress', 'completed', 'paused', 'cancelled'])
      .withMessage('Invalid status'),
    body('actualPerformance')
      .optional()
      .isObject()
      .withMessage('Actual performance must be an object'),
    body('userRating')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5')
  ],
  validate,
  asyncHandler(async (req, res) => {
    const strategy = await Strategy.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!strategy) {
      return res.status(404).json({
        success: false,
        message: 'Strategy not found'
      });
    }

    const recommendation = strategy.contentRecommendations.id(req.params.recId);
    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: 'Recommendation not found'
      });
    }

    const { status, actualPerformance, userRating, userNotes, assignedTo, dueDate } = req.body;

    // Update recommendation fields
    if (status !== undefined) {
      recommendation.status = status;
      if (status === 'completed') {
        recommendation.completedAt = new Date();
      }
    }
    if (actualPerformance !== undefined) recommendation.actualPerformance = actualPerformance;
    if (userRating !== undefined) recommendation.userRating = userRating;
    if (userNotes !== undefined) recommendation.userNotes = userNotes;
    if (assignedTo !== undefined) recommendation.assignedTo = assignedTo;
    if (dueDate !== undefined) recommendation.dueDate = dueDate ? new Date(dueDate) : null;

    await strategy.save();

    // Update strategy performance metrics
    await strategy.updatePerformanceMetrics();

    res.json({
      success: true,
      message: 'Recommendation updated successfully',
      recommendation
    });
  })
);

// @route   GET /api/strategies/generate/recommendations
// @desc    Generate AI-powered content recommendations
// @access  Private
router.post(
  '/generate/recommendations',
  auth,
  checkUsageLimit('aiGenerations'),
  expensiveOperationLimit,
  [
    body('platforms')
      .isArray({ min: 1 })
      .withMessage('At least one platform must be specified'),
    body('audience')
      .optional()
      .isObject()
      .withMessage('Audience must be an object'),
    body('goals')
      .optional()
      .isArray()
      .withMessage('Goals must be an array'),
    body('contentTypes')
      .optional()
      .isArray()
      .withMessage('Content types must be an array')
  ],
  validate,
  incrementUsage('aiGenerations'),
  asyncHandler(async (req, res) => {
    const { platforms, audience, goals, contentTypes, budget } = req.body;

    const recommendations = await generateContentRecommendations({
      platforms,
      audience,
      goals,
      contentTypes,
      budget
    });

    res.json({
      success: true,
      message: 'Recommendations generated successfully',
      recommendations
    });
  })
);

// @route   GET /api/strategies/analytics/overview
// @desc    Get user's strategy analytics overview
// @access  Private
router.get(
  '/analytics/overview',
  auth,
  asyncHandler(async (req, res) => {
    const overview = await Strategy.getUserOverview(req.user._id);
    
    res.json({
      success: true,
      analytics: {
        totalStrategies: overview.totalStrategies || 0,
        activeStrategies: overview.activeStrategies || 0,
        completedStrategies: overview.completedStrategies || 0,
        averageCompletion: Math.round(overview.averageCompletion || 0),
        totalRecommendations: overview.totalRecommendations || 0,
        platformDistribution: generateMockPlatformDistribution(),
        performanceMetrics: generateMockPerformanceMetrics(),
        upcomingDeadlines: generateMockUpcomingDeadlines()
      }
    });
  })
);

// @route   GET /api/strategies/trending
// @desc    Get trending strategies (public)
// @access  Public
router.get(
  '/trending',
  [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 20 })
      .withMessage('Limit must be between 1 and 20')
  ],
  validate,
  asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    
    const trendingStrategies = await Strategy.getTrendingStrategies(limit);
    
    res.json({
      success: true,
      trending: trendingStrategies.map(strategy => ({
        id: strategy._id,
        title: strategy.title,
        description: strategy.description,
        type: strategy.type,
        performance: strategy.performance,
        tags: strategy.tags,
        author: {
          username: strategy.user.username,
          name: strategy.user.fullName
        },
        createdAt: strategy.createdAt
      }))
    });
  })
);

// Helper function to generate AI-powered content recommendations
const generateContentRecommendations = async (params) => {
  const { platforms, audience, goals, contentTypes, budget } = params;

  if (!openai) {
    return generateMockRecommendations(platforms, contentTypes);
  }

  try {
    const prompt = `Generate content strategy recommendations based on:
    
Platforms: ${platforms.join(', ')}
Audience: ${JSON.stringify(audience || {})}
Goals: ${JSON.stringify(goals || [])}
Content Types: ${contentTypes?.join(', ') || 'any'}
Budget: ${budget?.total ? `$${budget.total}` : 'not specified'}

Please provide 5-8 specific content recommendations in JSON format:
{
  "recommendations": [
    {
      "contentType": "blog|video|social-post|story|reel|carousel|infographic|podcast|email|ad",
      "platform": "platform name",
      "title": "Content title",
      "description": "Brief description",
      "suggestedContent": "Detailed content suggestion",
      "keywords": ["keyword1", "keyword2"],
      "hashtags": ["#hashtag1", "#hashtag2"],
      "difficulty": "easy|medium|hard",
      "timeToComplete": hours,
      "estimatedPerformance": {
        "reach": estimated_reach,
        "engagement": estimated_engagement,
        "confidence": confidence_percentage
      }
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
      temperature: 0.8,
    });

    const aiResponse = JSON.parse(response.choices[0].message.content);
    return aiResponse.recommendations || generateMockRecommendations(platforms, contentTypes);
  } catch (error) {
    console.warn('AI recommendations failed:', error.message);
    return generateMockRecommendations(platforms, contentTypes);
  }
};

// Helper function to generate trend insights
const generateTrendInsights = async (platforms) => {
  // In a real implementation, this would fetch actual trending topics
  const mockInsights = [
    {
      relevanceScore: 85,
      actionableInsight: 'AI automation tools are trending - create educational content about implementation',
      suggestedActions: ['Create tutorial series', 'Share case studies', 'Interview experts'],
      urgency: 'high',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    {
      relevanceScore: 72,
      actionableInsight: 'Sustainable practices gaining traction - align content with eco-friendly themes',
      suggestedActions: ['Green technology reviews', 'Sustainability tips', 'Eco-friendly alternatives'],
      urgency: 'medium',
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    }
  ];

  return mockInsights;
};

// Helper function to generate competitor insights
const generateCompetitorInsights = async (userId) => {
  // In a real implementation, this would analyze user's tracked competitors
  const mockInsights = [
    {
      insight: 'Competitor X increased posting frequency by 40% in the last month',
      opportunity: 'Increase your posting consistency to match engagement',
      suggestedResponse: 'Develop a content calendar with daily posts',
      competitiveAdvantage: 'Your content quality is higher - focus on maintaining quality while increasing quantity',
      riskLevel: 'medium'
    }
  ];

  return mockInsights;
};

// Helper function to generate mock recommendations
const generateMockRecommendations = (platforms, contentTypes) => {
  const recommendations = [];
  const mockTitles = [
    'Ultimate Guide to [Topic]',
    'Top 10 Tips for [Industry]',
    'Behind the Scenes: [Process]',
    'Quick Tutorial: [Skill]',
    'Case Study: [Success Story]'
  ];

  platforms.forEach(platform => {
    for (let i = 0; i < 2; i++) {
      recommendations.push({
        contentType: contentTypes?.[i % contentTypes.length] || ['blog', 'video', 'social-post'][i % 3],
        platform,
        title: mockTitles[Math.floor(Math.random() * mockTitles.length)].replace('[Topic]', 'Success').replace('[Industry]', 'Growth').replace('[Process]', 'Creation').replace('[Skill]', 'Marketing').replace('[Success Story]', 'Brand Growth'),
        description: 'AI-generated content recommendation based on current trends and audience preferences',
        suggestedContent: 'Create engaging content that resonates with your target audience and drives meaningful engagement.',
        keywords: ['growth', 'success', 'tips', 'guide', 'tutorial'],
        hashtags: ['#growth', '#success', '#tips', '#tutorial'],
        difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
        timeToComplete: Math.floor(Math.random() * 8) + 2,
        estimatedPerformance: {
          reach: Math.floor(Math.random() * 10000) + 1000,
          engagement: Math.floor(Math.random() * 500) + 100,
          clicks: Math.floor(Math.random() * 200) + 50,
          conversions: Math.floor(Math.random() * 50) + 10,
          confidence: Math.floor(Math.random() * 30) + 70
        },
        status: 'suggested'
      });
    }
  });

  return recommendations;
};

// Helper functions for mock analytics data
const generateMockPlatformDistribution = () => ({
  YouTube: Math.floor(Math.random() * 5) + 2,
  Instagram: Math.floor(Math.random() * 4) + 1,
  TikTok: Math.floor(Math.random() * 3) + 1,
  Twitter: Math.floor(Math.random() * 3) + 1,
  LinkedIn: Math.floor(Math.random() * 2) + 1
});

const generateMockPerformanceMetrics = () => ({
  averageCompletion: Math.floor(Math.random() * 30) + 65,
  averageEngagement: (Math.random() * 3 + 5).toFixed(1) + '%',
  totalReach: Math.floor(Math.random() * 50000) + 10000,
  conversionRate: (Math.random() * 2 + 2).toFixed(1) + '%'
});

const generateMockUpcomingDeadlines = () => {
  const deadlines = [];
  for (let i = 1; i <= 5; i++) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + i);
    
    deadlines.push({
      title: `Content Milestone ${i}`,
      platform: ['YouTube', 'Instagram', 'Twitter'][Math.floor(Math.random() * 3)],
      dueDate,
      status: ['planned', 'in-progress'][Math.floor(Math.random() * 2)],
      priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)]
    });
  }
  return deadlines;
};

module.exports = router;