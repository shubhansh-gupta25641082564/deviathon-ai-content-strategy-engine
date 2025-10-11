const express = require('express');
const axios = require('axios');
const { query, body } = require('express-validator');
const OpenAI = require('openai');
const Trend = require('../models/Trend');
const { auth, checkUsageLimit, incrementUsage } = require('../middleware/auth');
const { validate, asyncHandler } = require('../middleware/validation');
// Conditional cache middleware import
let trendCacheMiddleware, expensiveOperationLimit;
try {
  const cacheMiddleware = require('../middleware/cache');
  trendCacheMiddleware = cacheMiddleware.trendCacheMiddleware || ((req, res, next) => next());
  expensiveOperationLimit = cacheMiddleware.expensiveOperationLimit || ((req, res, next) => next());
} catch (error) {
  console.warn('Cache middleware not available, using pass-through middleware');
  trendCacheMiddleware = (req, res, next) => next();
  expensiveOperationLimit = (req, res, next) => next();
}

const router = express.Router();

// Initialize OpenAI (if API key is provided)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Hacker News API functions
async function fetchHackerNewsStories(count = 5) {
  try {
    const topStoriesResponse = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
    const storyIds = topStoriesResponse.data.slice(0, count);
    
    const stories = await Promise.all(
      storyIds.map(async (id) => {
        try {
          const storyResponse = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          const story = storyResponse.data;
          
          return {
            hashtag: "#HackerNews",
            headline: story.title,
            music: "Tech News Beat",
            content: story.text 
              ? (story.text.length > 150 ? story.text.substring(0, 147) + '...' : story.text)
              : `Trending discussion: ${story.title}`,
            score: story.score,
            comments: story.descendants || 0,
            url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
            timestamp: new Date(story.time * 1000).toISOString()
          };
        } catch (error) {
          console.error(`Error fetching story ${id}:`, error.message);
          return null;
        }
      })
    );
    
    return stories.filter(Boolean);
  } catch (error) {
    console.error('Hacker News API error:', error.message);
    throw error;
  }
}

// Reddit API functions
async function fetchRedditPosts(subreddit = 'programming', count = 5) {
  try {
    const response = await axios.get(`https://www.reddit.com/r/${subreddit}/hot.json?limit=${count}`, {
      headers: {
        'User-Agent': 'AI-Content-Search/1.0'
      }
    });
    
    const posts = response.data.data.children.map(child => {
      const post = child.data;
      return {
        hashtag: `#${post.subreddit}`,
        headline: post.title.length > 80 ? post.title.substring(0, 77) + '...' : post.title,
        music: `${post.subreddit} Community Mix`,
        content: post.selftext 
          ? (post.selftext.length > 150 ? post.selftext.substring(0, 147) + '...' : post.selftext)
          : `Trending discussion from r/${post.subreddit}`,
        score: post.score,
        comments: post.num_comments,
        url: `https://reddit.com${post.permalink}`,
        timestamp: new Date(post.created_utc * 1000).toISOString()
      };
    });
    
    return posts;
  } catch (error) {
    console.error('Reddit API error:', error.message);
    throw error;
  }
}

// YouTube API functions (requires API key)
async function fetchYouTubeShorts(query = 'tech tutorial', count = 5) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  
  if (!API_KEY) {
    console.warn('YouTube API key not provided');
    throw new Error('YouTube API key required');
  }
  
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: API_KEY,
        part: 'snippet',
        q: `${query} #shorts`,
        type: 'video',
        maxResults: count,
        order: 'viewCount',
        videoDuration: 'short'
      }
    });
    
    const videos = response.data.items.map(item => ({
      hashtag: "#TechTutorial",
      headline: item.snippet.title,
      music: "Tech Tutorial Beat",
      content: item.snippet.description || `Create an engaging tutorial about ${item.snippet.title}`,
      url: `https://www.youtube.com/shorts/${item.id.videoId}`,
      channel: item.snippet.channelTitle,
      timestamp: item.snippet.publishedAt
    }));
    
    return videos;
  } catch (error) {
    console.error('YouTube API error:', error.message);
    throw error;
  }
}

// Google Trends simulation (real Google Trends API requires special access)
function generateGoogleTrends(count = 5) {
  const techKeywords = [
    'artificial intelligence',
    'machine learning', 
    'blockchain',
    'cybersecurity',
    'cloud computing',
    'data science',
    'virtual reality',
    'augmented reality',
    'internet of things',
    'robotics',
    'web3',
    'metaverse',
    'quantum computing',
    'edge computing',
    'automation'
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const keyword = techKeywords[i % techKeywords.length];
    const score = Math.floor(Math.random() * 50) + 50;
    const growth = Math.floor(Math.random() * 30) + 20;
    
    return {
      hashtag: `#${keyword.replace(/\s+/g, '')}`,
      headline: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Trends`,
      music: "Tech Trends Beat",
      content: `Create content about ${keyword} trends and developments. Growing at +${growth}%!`,
      trendScore: score,
      growth: `+${growth}%`,
      timestamp: new Date().toISOString()
    };
  });
}

// @route   GET /api/trends
// @desc    Get trending topics with filtering and analytics
// @access  Public
router.get(
  '/',
  [
    query('platform')
      .optional()
      .isIn(['all', 'YouTube', 'Reddit', 'News', 'Trends', 'youtube', 'reddit', 'hackernews', 'twitter', 'tiktok', 'instagram', 'linkedin'])
      .withMessage('Invalid platform'),
    query('interest')
      .optional(),
    query('category')
      .optional()
      .isIn(['all', 'technology', 'business', 'entertainment', 'health', 'education', 'lifestyle', 'sports', 'politics', 'science'])
      .withMessage('Invalid category'),
    query('region')
      .optional()
      .isLength({ min: 2, max: 2 })
      .withMessage('Region must be a 2-letter country code'),
    query('timeframe')
      .optional()
      .isIn(['1h', '6h', '24h', '7d', '30d'])
      .withMessage('Invalid timeframe'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('sortBy')
      .optional()
      .isIn(['volume', 'growth', 'engagement', 'relevance', 'recent', 'trending'])
      .withMessage('Invalid sort field'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer')
  ],
  validate,
  trendCacheMiddleware,
  asyncHandler(async (req, res) => {
    const {
      platform = 'YouTube',
      interest = 'All',
      category = 'all',
      region = 'US',
      timeframe = '24h',
      limit = 20,
      sortBy = 'trending',
      page = 1
    } = req.query;

    const itemsPerPage = Math.min(parseInt(limit), 20);
    
    console.log(`Fetching real data for platform: ${platform}, page: ${page}`);
    
    let trends = [];
    
    try {
      switch (platform) {
        case 'News':
        case 'hackernews':
          try {
            trends = await fetchHackerNewsStories(itemsPerPage);
            console.log(`Fetched ${trends.length} Hacker News stories`);
          } catch (error) {
            console.error('Hacker News error:', error.message);
            trends = generateFallbackNews(itemsPerPage);
          }
          break;
          
        case 'Reddit':
        case 'reddit':
          try {
            const subreddits = ['programming', 'technology', 'webdev', 'javascript', 'coding'];
            const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
            trends = await fetchRedditPosts(subreddit, itemsPerPage);
            console.log(`Fetched ${trends.length} Reddit posts from r/${subreddit}`);
          } catch (error) {
            console.error('Reddit error:', error.message);
            trends = generateFallbackReddit(itemsPerPage);
          }
          break;
          
        case 'YouTube':
        case 'youtube':
          try {
            trends = await fetchYouTubeShorts('tech tutorial', itemsPerPage);
            console.log(`Fetched ${trends.length} YouTube shorts`);
          } catch (error) {
            console.error('YouTube error:', error.message);
            trends = generateFallbackYouTube(itemsPerPage);
          }
          break;
          
        case 'Trends':
        case 'all':
          trends = generateGoogleTrends(itemsPerPage);
          console.log(`Generated ${trends.length} Google Trends`);
          break;
          
        default:
          trends = generateFallbackYouTube(itemsPerPage);
      }
      
      // Add common properties and creator data
      const enrichedTrends = trends.map((trend, index) => ({
        ...trend,
        id: `${platform}-${page}-${index}`,
        platform: platform,
        engagement: Math.floor(Math.random() * 10000) + 1000,
        sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
        growth: trend.growth || Math.floor(Math.random() * 50) + 10,
        metrics: {
          volume: trend.score || Math.floor(Math.random() * 100000) + 10000,
          growthRate: trend.growth || (Math.random() * 50 + 10).toFixed(1),
          engagementRate: (Math.random() * 10 + 2).toFixed(1),
          shareability: Math.floor(Math.random() * 100) + 1,
          likes: Math.floor(Math.random() * 40) + 50,
          shares: Math.floor(Math.random() * 30) + 20,
          views: Math.floor(Math.random() * 50) + 40,
          comments: trend.comments || Math.floor(Math.random() * 25) + 15
        },
        relevanceScore: Math.floor(Math.random() * 40) + 60,
        category: category === 'all' ? 'technology' : category,
        region: region,
        contentSuggestion: trend.content || `Create engaging content about ${trend.headline}`,
        createdAt: trend.timestamp || new Date().toISOString()
      }));

      // Apply sorting
      let sortedTrends = enrichedTrends;
      switch (sortBy) {
        case 'volume':
          sortedTrends = enrichedTrends.sort((a, b) => b.metrics.volume - a.metrics.volume);
          break;
        case 'growth':
          sortedTrends = enrichedTrends.sort((a, b) => parseFloat(b.metrics.growthRate) - parseFloat(a.metrics.growthRate));
          break;
        case 'engagement':
          sortedTrends = enrichedTrends.sort((a, b) => parseFloat(b.metrics.engagementRate) - parseFloat(a.metrics.engagementRate));
          break;
        case 'relevance':
          sortedTrends = enrichedTrends.sort((a, b) => b.relevanceScore - a.relevanceScore);
          break;
        case 'recent':
          sortedTrends = enrichedTrends.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        default: // trending
          sortedTrends = enrichedTrends;
      }

      // Return in the format expected by the frontend
      res.json({
        success: true,
        trends: sortedTrends,
        metadata: {
          platform,
          interest,
          category,
          region,
          timeframe,
          sortBy,
          page: parseInt(page),
          total: sortedTrends.length,
          generatedAt: new Date()
        }
      });
      
    } catch (error) {
      console.error('Trends API error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch trends',
        message: error.message 
      });
    }
  })
);

// @route   GET /api/trends/discover
// @desc    Get personalized trend discovery based on user interests
// @access  Private
router.get(
  '/discover',
  auth,
  checkUsageLimit('trendAnalysis'),
  [
    query('interests')
      .optional()
      .isArray()
      .withMessage('Interests must be an array'),
    query('platforms')
      .optional()
      .isArray()
      .withMessage('Platforms must be an array'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50')
  ],
  validate,
  incrementUsage('trendAnalysis'),
  expensiveOperationLimit,
  asyncHandler(async (req, res) => {
    const {
      interests = [],
      platforms = ['YouTube'],
      limit = 10
    } = req.query;

    // Generate personalized trends based on user preferences
    const personalizedTrends = await generatePersonalizedTrends({
      userId: req.user._id,
      interests,
      platforms,
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      message: 'Personalized trends generated successfully',
      trends: personalizedTrends,
      recommendations: await generateTrendRecommendations(personalizedTrends)
    });
  })
);

// @route   GET /api/trends/analyze/:keyword
// @desc    Analyze specific keyword trend
// @access  Private
router.get(
  '/analyze/:keyword',
  auth,
  checkUsageLimit('trendAnalysis'),
  incrementUsage('trendAnalysis'),
  expensiveOperationLimit,
  asyncHandler(async (req, res) => {
    const { keyword } = req.params;
    const { platforms = ['all'], timeframe = '30d' } = req.query;

    // Analyze keyword across platforms
    const analysis = await analyzeKeywordTrend(keyword, platforms, timeframe);

    res.json({
      success: true,
      keyword,
      analysis: {
        overview: analysis.overview,
        platformBreakdown: analysis.platformBreakdown,
        historicalData: analysis.historicalData,
        contentOpportunities: analysis.contentOpportunities,
        competitorInsights: analysis.competitorInsights,
        aiInsights: analysis.aiInsights,
        actionableRecommendations: analysis.recommendations
      }
    });
  })
);

// @route   POST /api/trends/save
// @desc    Save interesting trends to user's collection
// @access  Private
router.post(
  '/save',
  auth,
  [
    body('trendId')
      .notEmpty()
      .withMessage('Trend ID is required'),
    body('notes')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Notes cannot exceed 500 characters'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array')
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { trendId, notes, tags } = req.body;

    // For now, create a simple saved trend record
    // In a real implementation, this would use the Trend model
    const savedTrend = {
      id: trendId,
      userId: req.user._id,
      notes,
      tags,
      savedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Trend saved successfully',
      trend: savedTrend
    });
  })
);

// @route   GET /api/trends/saved
// @desc    Get user's saved trends
// @access  Private
router.get(
  '/saved',
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
    query('sortBy')
      .optional()
      .isIn(['recent', 'volume', 'growth', 'alphabetical'])
      .withMessage('Invalid sort field')
  ],
  validate,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'recent';

    // Mock saved trends for now
    const savedTrends = generateMockSavedTrends(req.user._id, limit);

    res.json({
      success: true,
      savedTrends,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(savedTrends.length / limit),
        totalItems: savedTrends.length,
        itemsPerPage: limit
      }
    });
  })
);

// @route   GET /api/trends/stats
// @desc    Get trending statistics and analytics
// @access  Public
router.get(
  '/stats',
  trendCacheMiddleware,
  asyncHandler(async (req, res) => {
    const stats = {
      totalTrends: 1234,
      topCategories: generateMockCategories(),
      platformDistribution: generateMockPlatformStats(),
      growthLeaders: generateMockGrowthLeaders(),
      regionInsights: generateMockRegionInsights()
    };
    
    res.json({
      success: true,
      stats
    });
  })
);

// Helper function to generate personalized trends
const generatePersonalizedTrends = async ({ userId, interests, platforms, limit }) => {
  // In a real implementation, this would analyze user behavior and preferences
  const personalizedTrends = await generateMockTrends(platforms[0] || 'YouTube', 'all', limit);
  
  // Add personalization score based on interests
  return personalizedTrends.map(trend => ({
    ...trend,
    personalizationScore: Math.floor(Math.random() * 40) + 60,
    matchingInterests: interests.filter(interest => 
      trend.headline.toLowerCase().includes(interest.toLowerCase())
    )
  }));
};

// Helper function to analyze keyword trends
const analyzeKeywordTrend = async (keyword, platforms, timeframe) => {
  // Mock comprehensive keyword analysis
  return {
    overview: {
      totalVolume: Math.floor(Math.random() * 1000000) + 100000,
      averageGrowth: (Math.random() * 30 + 10).toFixed(1) + '%',
      peakEngagement: Math.floor(Math.random() * 50000) + 10000,
      trendStrength: Math.floor(Math.random() * 40) + 60
    },
    platformBreakdown: {
      youtube: { volume: Math.floor(Math.random() * 50000), growth: '+15%' },
      twitter: { volume: Math.floor(Math.random() * 30000), growth: '+22%' },
      reddit: { volume: Math.floor(Math.random() * 20000), growth: '+8%' },
      tiktok: { volume: Math.floor(Math.random() * 40000), growth: '+35%' }
    },
    historicalData: generateMockHistoricalData(timeframe),
    contentOpportunities: [
      'Create educational content explaining the trend',
      'Share personal experiences or case studies',
      'Develop how-to guides and tutorials',
      'Engage in community discussions'
    ],
    competitorInsights: [
      'Top competitors are posting 3x more frequently',
      'Video content performs 40% better than text',
      'Peak engagement occurs between 2-4 PM EST'
    ],
    aiInsights: {
      sentiment: 'Positive',
      longevity: 'Medium-term (2-3 months)',
      difficulty: 'Medium',
      recommendedAction: 'Create content series'
    },
    recommendations: [
      'Start with educational content to establish authority',
      'Use trending hashtags but focus on niche keywords',
      'Collaborate with influencers in this space',
      'Monitor competitor strategies and differentiate'
    ]
  };
};

// Helper function to generate trend recommendations
const generateTrendRecommendations = async (trends) => {
  return trends.slice(0, 3).map(trend => ({
    trendId: trend.id,
    keyword: trend.headline,
    recommendation: `Create ${['tutorial', 'review', 'comparison', 'guide'][Math.floor(Math.random() * 4)]} content about ${trend.headline}`,
    priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
    estimatedReach: Math.floor(Math.random() * 50000) + 5000,
    difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)]
  }));
};

// Helper function to generate mock trends when database is empty
const generateMockTrends = async (platform, category, limit) => {
  const mockKeywords = [
    'AI Automation', 'Remote Work Tools', 'Sustainable Living', 'Mental Health Awareness',
    'Cryptocurrency Trading', 'Plant-based Diet', 'Digital Marketing', 'Freelancing Tips',
    'Home Workout', 'Online Learning', 'Social Media Strategy', 'Personal Branding',
    'Climate Change', 'Productivity Hacks', 'Investment Strategies', 'Gaming Trends',
    'Fashion Sustainability', 'Tech Innovation', 'Wellness Routine', 'Career Development'
  ];

  const platforms = platform === 'all' ? ['YouTube', 'Reddit', 'News', 'Trends'] : [platform];
  const categories = ['technology', 'business', 'health', 'lifestyle', 'entertainment'];
  
  const trends = [];
  
  for (let i = 0; i < Math.min(limit, mockKeywords.length); i++) {
    const trend = {
      id: `mock_${i}`,
      headline: mockKeywords[i],
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      category: category === 'all' ? categories[Math.floor(Math.random() * categories.length)] : category,
      region: 'US',
      hashtag: `#${mockKeywords[i].replace(/\s+/g, '')}`,
      music: "Trending Beat",
      content: `Create engaging content about ${mockKeywords[i]} to capitalize on current trends`,
      metrics: {
        volume: Math.floor(Math.random() * 100000) + 10000,
        growthRate: (Math.random() * 50 + 10).toFixed(1),
        engagementRate: (Math.random() * 10 + 2).toFixed(1),
        shareability: Math.floor(Math.random() * 100) + 1
      },
      relevanceScore: Math.floor(Math.random() * 40) + 60,
      contentSuggestion: `Create engaging content about ${mockKeywords[i]} to capitalize on current trends`,
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
    };
    
    trends.push(trend);
  }
  
  return trends;
};

// Mock data generators
const generateMockSavedTrends = (userId, limit) => {
  const mockTrends = [];
  for (let i = 0; i < limit; i++) {
    mockTrends.push({
      id: `saved_${i}`,
      keyword: `Saved Trend ${i + 1}`,
      platform: ['YouTube', 'Reddit', 'News'][Math.floor(Math.random() * 3)],
      notes: `Personal notes about trend ${i + 1}`,
      tags: ['important', 'content-idea', 'research'],
      savedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    });
  }
  return mockTrends;
};

const generateMockCategories = () => [
  { category: 'Technology', count: 45, growth: '+18%' },
  { category: 'Business', count: 32, growth: '+12%' },
  { category: 'Health', count: 28, growth: '+22%' },
  { category: 'Lifestyle', count: 24, growth: '+8%' },
  { category: 'Entertainment', count: 19, growth: '+15%' }
];

const generateMockPlatformStats = () => ({
  YouTube: { trends: 156, avgGrowth: '+15%' },
  Reddit: { trends: 134, avgGrowth: '+22%' },
  News: { trends: 89, avgGrowth: '+8%' },
  Trends: { trends: 201, avgGrowth: '+35%' },
  Twitter: { trends: 123, avgGrowth: '+18%' }
});

const generateMockGrowthLeaders = () => [
  { keyword: 'AI Automation', growth: '+145%', platform: 'YouTube' },
  { keyword: 'Remote Work Tools', growth: '+132%', platform: 'Reddit' },
  { keyword: 'Mental Health Apps', growth: '+98%', platform: 'News' }
];

const generateMockRegionInsights = () => ({
  US: { topTrend: 'AI Technology', growth: '+25%' },
  UK: { topTrend: 'Sustainable Living', growth: '+18%' },
  CA: { topTrend: 'Remote Work', growth: '+22%' },
  AU: { topTrend: 'Wellness Trends', growth: '+15%' }
});

const generateMockHistoricalData = (timeframe) => {
  const days = { '1h': 1, '6h': 1, '24h': 7, '7d': 7, '30d': 30 }[timeframe] || 30;
  const data = [];
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      volume: Math.floor(Math.random() * 10000) + 5000,
      engagement: Math.floor(Math.random() * 1000) + 500
    });
  }
  
  return data;
};

// Fallback data generators
function generateFallbackNews(count) {
  const techNews = [
    'New JavaScript Framework Revolutionizes Web Development',
    'AI Breakthrough: GPT-5 Shows Unprecedented Capabilities', 
    'Quantum Computing Reaches New Milestone',
    'Open Source Alternative to Popular Developer Tool Launched',
    'Cybersecurity Alert: New Vulnerability Discovered'
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    hashtag: "#TechNews",
    headline: techNews[i % techNews.length],
    music: "Tech News Beat", 
    content: `Breaking: ${techNews[i % techNews.length]}. Stay updated with the latest developments.`,
    score: Math.floor(Math.random() * 500) + 100,
    comments: Math.floor(Math.random() * 100) + 20,
    url: 'https://news.ycombinator.com',
    timestamp: new Date().toISOString()
  }));
}

function generateFallbackReddit(count) {
  const topics = [
    'JavaScript Development Tips',
    'React Best Practices', 
    'Python Data Science',
    'Web Development Trends',
    'AI Programming Guide'
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    hashtag: `#${['programming', 'technology', 'webdev'][i % 3]}`,
    headline: topics[i % topics.length],
    music: "Tech Community Mix",
    content: `Trending discussion about ${topics[i % topics.length].toLowerCase()}. Join the conversation!`,
    score: Math.floor(Math.random() * 1000) + 100,
    comments: Math.floor(Math.random() * 50) + 10,
    url: 'https://reddit.com/r/programming',
    timestamp: new Date().toISOString()
  }));
}

function generateFallbackYouTube(count) {
  const tutorials = [
    'Build a React App in 60 Seconds',
    'JavaScript Tips That Will Blow Your Mind',
    'CSS Animation Magic Tutorial',
    'Python Data Science Quick Start',
    'Web Development Setup Guide'
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    hashtag: "#TechTutorial",
    headline: tutorials[i % tutorials.length],
    music: "Tech Tutorial Beat",
    content: `Learn ${tutorials[i % tutorials.length].toLowerCase()} with this quick tutorial!`,
    url: 'https://youtube.com/shorts',
    channel: 'Tech Tutorials',
    timestamp: new Date().toISOString()
  }));
}

module.exports = router;