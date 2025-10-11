const express = require('express');
const { body, query } = require('express-validator');
const OpenAI = require('openai');
const Sentiment = require('sentiment');
const ContentAnalysis = require('../models/ContentAnalysis');
const { auth } = require('../middleware/auth');
const { validate, asyncHandler } = require('../middleware/validation');
const { checkUsageLimit, incrementUsage } = require('../middleware/auth');
const { contentCacheMiddleware, expensiveOperationLimit } = require('../middleware/cache');

const router = express.Router();
const sentiment = new Sentiment();

// Initialize OpenAI (if API key is provided)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Helper function to calculate readability score
const calculateReadabilityScore = (text) => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const syllables = words.reduce((total, word) => {
    return total + countSyllables(word);
  }, 0);

  if (sentences.length === 0 || words.length === 0) {
    return { score: 0, level: 'Unknown', fleschScore: 0, gradeLevel: 0 };
  }

  const averageWordsPerSentence = words.length / sentences.length;
  const averageSyllablesPerWord = syllables / words.length;

  // Flesch Reading Ease Score
  const fleschScore = 206.835 - (1.015 * averageWordsPerSentence) - (84.6 * averageSyllablesPerWord);
  
  // Flesch-Kincaid Grade Level
  const gradeLevel = (0.39 * averageWordsPerSentence) + (11.8 * averageSyllablesPerWord) - 15.59;

  let level = 'Unknown';
  let score = Math.max(0, Math.min(100, fleschScore));

  if (fleschScore >= 90) level = 'Very Easy';
  else if (fleschScore >= 80) level = 'Easy';
  else if (fleschScore >= 70) level = 'Fairly Easy';
  else if (fleschScore >= 60) level = 'Standard';
  else if (fleschScore >= 50) level = 'Fairly Difficult';
  else if (fleschScore >= 30) level = 'Difficult';
  else level = 'Very Difficult';

  return {
    score: Math.round(score),
    level,
    fleschScore: Math.round(fleschScore * 100) / 100,
    gradeLevel: Math.max(0, Math.round(gradeLevel * 100) / 100)
  };
};

// Helper function to count syllables
const countSyllables = (word) => {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  
  const vowels = 'aeiouy';
  let syllableCount = 0;
  let previousWasVowel = false;

  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !previousWasVowel) {
      syllableCount++;
    }
    previousWasVowel = isVowel;
  }

  // Handle silent 'e'
  if (word.endsWith('e')) {
    syllableCount--;
  }

  return Math.max(1, syllableCount);
};

// Helper function to extract keywords
const extractKeywords = (text) => {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3);

  const stopWords = new Set([
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'any', 'can', 'had',
    'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how',
    'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'she',
    'use', 'her', 'way', 'many', 'oil', 'sit', 'set', 'say', 'too', 'any', 'may',
    'try', 'ask', 'men', 'run', 'own', 'say', 'she', 'try', 'way', 'who', 'its',
    'said', 'each', 'make', 'most', 'over', 'said', 'some', 'time', 'very', 'when',
    'come', 'here', 'just', 'like', 'long', 'many', 'over', 'such', 'take', 'than',
    'them', 'well', 'were', 'what', 'with', 'have', 'from', 'they', 'know', 'want',
    'been', 'good', 'much', 'some', 'time', 'very', 'when', 'come', 'here', 'just',
    'like', 'long', 'many', 'over', 'such', 'take', 'than', 'them', 'well', 'were'
  ]);

  const wordCount = {};
  words.forEach(word => {
    if (!stopWords.has(word)) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });

  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20)
    .map(([keyword, frequency], index) => ({
      keyword,
      frequency,
      relevance: Math.max(0, 100 - (index * 5)),
      position: index + 1
    }));
};

// Helper function to analyze SEO factors
const analyzeSEO = (text, title = '') => {
  const wordCount = text.split(/\s+/).length;
  const keywords = extractKeywords(text);
  
  let score = 50; // Base score
  
  // Word count scoring
  if (wordCount >= 300 && wordCount <= 2000) score += 15;
  else if (wordCount >= 200) score += 10;
  else if (wordCount < 100) score -= 10;
  
  // Keyword density
  let keywordDensity = 0;
  if (keywords.length > 0) {
    const topKeyword = keywords[0];
    keywordDensity = (topKeyword.frequency / wordCount) * 100;
    
    if (keywordDensity >= 1 && keywordDensity <= 3) score += 20;
    else if (keywordDensity > 3) score -= 10; // Keyword stuffing
  }
  
  // Title analysis
  if (title) {
    if (title.length >= 30 && title.length <= 60) score += 10;
    if (keywords.some(k => title.toLowerCase().includes(k.keyword))) score += 10;
  }
  
  // Link analysis (simplified)
  const internalLinks = (text.match(/\[.*?\]\(\/.*?\)/g) || []).length;
  const externalLinks = (text.match(/\[.*?\]\(https?:\/\/.*?\)/g) || []).length;
  
  if (internalLinks > 0) score += 5;
  if (externalLinks > 0 && externalLinks <= 3) score += 5;
  
  // Heading structure (simplified)
  const headings = (text.match(/^#{1,6}\s/gm) || []).length;
  const headingStructure = headings > 0;
  if (headingStructure) score += 10;
  
  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    keywordDensity: Math.round(keywordDensity * 100) / 100,
    metaDescription: title.length > 0,
    headingStructure,
    internalLinks,
    externalLinks
  };
};

// Helper function to analyze engagement potential
const analyzeEngagement = (text) => {
  let score = 50; // Base score
  
  // Question count
  const questionCount = (text.match(/\?/g) || []).length;
  if (questionCount > 0) score += Math.min(15, questionCount * 3);
  
  // Exclamation count
  const exclamationCount = (text.match(/!/g) || []).length;
  if (exclamationCount > 0) score += Math.min(10, exclamationCount * 2);
  
  // Call to action phrases
  const ctaPhrases = [
    'click here', 'learn more', 'read more', 'get started', 'sign up', 'download',
    'subscribe', 'join', 'try', 'discover', 'explore', 'check out', 'find out',
    'contact', 'call', 'email', 'share', 'comment', 'like', 'follow'
  ];
  
  const callToAction = ctaPhrases.some(phrase => 
    text.toLowerCase().includes(phrase)
  );
  
  if (callToAction) score += 15;
  
  // Emotional words
  const emotionalWords = [
    'amazing', 'incredible', 'fantastic', 'wonderful', 'excellent', 'outstanding',
    'breakthrough', 'revolutionary', 'innovative', 'cutting-edge', 'exclusive',
    'limited', 'urgent', 'important', 'critical', 'essential', 'powerful',
    'proven', 'guaranteed', 'secret', 'hidden', 'revealed', 'exposed'
  ];
  
  const emotionalWordCount = emotionalWords.reduce((count, word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    return count + (text.match(regex) || []).length;
  }, 0);
  
  if (emotionalWordCount > 0) score += Math.min(20, emotionalWordCount * 2);
  
  // Emotional tone analysis
  const sentimentResult = sentiment.analyze(text);
  let emotionalTone = 'neutral';
  
  if (sentimentResult.score > 2) emotionalTone = 'positive';
  else if (sentimentResult.score < -2) emotionalTone = 'negative';
  
  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    emotionalTone,
    callToAction,
    questionCount,
    exclamationCount
  };
};

// Helper function to calculate content metrics
const calculateMetrics = (text) => {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const characters = text.length;
  
  const complexWords = words.filter(word => countSyllables(word) >= 3).length;
  const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
  
  const averageSentenceLength = sentences.length > 0 ? words.length / sentences.length : 0;
  const readingTime = Math.ceil(words.length / 200); // Assuming 200 words per minute
  
  return {
    wordCount: words.length,
    characterCount: characters,
    paragraphCount: paragraphs.length,
    sentenceCount: sentences.length,
    averageSentenceLength: Math.round(averageSentenceLength * 100) / 100,
    readingTime,
    complexWords,
    uniqueWords
  };
};

// AI-powered analysis (if OpenAI is available)
const getAIRecommendations = async (text, analysis) => {
  if (!openai) {
    return [
      {
        type: 'improvement',
        category: 'readability',
        title: 'Improve Readability',
        description: 'Consider breaking down complex sentences for better readability.',
        priority: 'medium',
        impact: 'Better user experience and engagement'
      },
      {
        type: 'optimization',
        category: 'seo',
        title: 'Optimize Keywords',
        description: 'Include more relevant keywords naturally throughout the content.',
        priority: 'high',
        impact: 'Improved search engine visibility'
      }
    ];
  }

  try {
    const prompt = `Analyze this content and provide specific recommendations for improvement:

Content: "${text.substring(0, 1000)}${text.length > 1000 ? '...' : ''}"

Current Analysis:
- Overall Score: ${analysis.overallScore}/100
- Readability: ${analysis.readability.level} (${analysis.readability.score}/100)
- SEO Score: ${analysis.seo.score}/100
- Engagement Score: ${analysis.engagement.score}/100
- Sentiment: ${analysis.sentiment.label}

Please provide 3-5 specific, actionable recommendations in JSON format:
{
  "recommendations": [
    {
      "type": "improvement|optimization|warning|suggestion",
      "category": "readability|seo|engagement|structure|tone",
      "title": "Brief title",
      "description": "Specific actionable advice",
      "priority": "low|medium|high|critical",
      "impact": "Expected benefit of implementing this"
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const aiResponse = JSON.parse(response.choices[0].message.content);
    return aiResponse.recommendations || [];
  } catch (error) {
    console.warn('AI recommendations failed:', error.message);
    return [
      {
        type: 'improvement',
        category: 'general',
        title: 'Content Enhancement',
        description: 'Consider reviewing and enhancing your content based on the analysis scores.',
        priority: 'medium',
        impact: 'Overall content quality improvement'
      }
    ];
  }
};

// @route   POST /api/analyze
// @desc    Analyze content
// @access  Private
router.post(
  '/',
  auth,
  checkUsageLimit('contentAnalyses'),
  expensiveOperationLimit,
  [
    body('content')
      .isLength({ min: 10, max: 50000 })
      .withMessage('Content must be between 10 and 50,000 characters'),
    body('title')
      .optional()
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('contentType')
      .optional()
      .isIn(['blog', 'social', 'email', 'video', 'other'])
      .withMessage('Invalid content type'),
    body('platform')
      .optional()
      .isIn(['YouTube', 'Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'Blog', 'Email', 'Other'])
      .withMessage('Invalid platform')
  ],
  validate,
  incrementUsage('contentAnalyses'),
  asyncHandler(async (req, res) => {
    const startTime = Date.now();
    const { content, title = '', contentType = 'other', platform = 'Other' } = req.body;

    try {
      // Perform various analyses
      const sentimentResult = sentiment.analyze(content);
      const readability = calculateReadabilityScore(content);
      const keywords = extractKeywords(content);
      const seoAnalysis = analyzeSEO(content, title);
      const engagementAnalysis = analyzeEngagement(content);
      const metrics = calculateMetrics(content);

      // Calculate sentiment score and label
      const sentimentScore = Math.max(0, Math.min(100, 50 + sentimentResult.score * 5));
      let sentimentLabel = 'Neutral';
      if (sentimentResult.score > 1) sentimentLabel = 'Positive';
      else if (sentimentResult.score < -1) sentimentLabel = 'Negative';

      // Calculate overall score
      const overallScore = Math.round(
        (sentimentScore * 0.2 + 
         readability.score * 0.3 + 
         seoAnalysis.score * 0.3 + 
         engagementAnalysis.score * 0.2)
      );

      const analysis = {
        overallScore,
        sentiment: {
          score: Math.round(sentimentScore),
          label: sentimentLabel,
          confidence: Math.abs(sentimentResult.score)
        },
        readability,
        seo: seoAnalysis,
        engagement: engagementAnalysis,
        metrics,
        keywords
      };

      // Get AI recommendations
      const recommendations = await getAIRecommendations(content, analysis);

      // Create analysis record
      const contentAnalysis = new ContentAnalysis({
        user: req.user._id,
        content,
        title,
        contentType,
        platform,
        analysis: {
          ...analysis,
          recommendations
        },
        status: 'completed',
        processingTime: Date.now() - startTime
      });

      await contentAnalysis.save();

      res.json({
        success: true,
        message: 'Content analysis completed successfully',
        analysis: {
          id: contentAnalysis._id,
          overallScore: analysis.overallScore,
          sentiment: analysis.sentiment,
          readability: analysis.readability,
          seo: analysis.seo,
          engagement: analysis.engagement,
          metrics: analysis.metrics,
          keywords: analysis.keywords.slice(0, 10), // Return top 10 keywords
          recommendations,
          processingTime: Date.now() - startTime
        }
      });

    } catch (error) {
      console.error('Content analysis error:', error);
      res.status(500).json({
        success: false,
        message: 'Content analysis failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  })
);

// @route   GET /api/analyze/history
// @desc    Get user's analysis history
// @access  Private
router.get(
  '/history',
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
      .isIn(['YouTube', 'Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'Blog', 'Email', 'Other', 'All'])
      .withMessage('Invalid platform'),
    query('contentType')
      .optional()
      .isIn(['blog', 'social', 'email', 'video', 'other', 'all'])
      .withMessage('Invalid content type')
  ],
  validate,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const platform = req.query.platform;
    const contentType = req.query.contentType;

    const query = { user: req.user._id };
    
    if (platform && platform !== 'All') {
      query.platform = platform;
    }
    
    if (contentType && contentType !== 'all') {
      query.contentType = contentType;
    }

    const analyses = await ContentAnalysis.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('title platform contentType analysis.overallScore analysis.sentiment analysis.metrics createdAt processingTime');

    const total = await ContentAnalysis.countDocuments(query);

    res.json({
      success: true,
      analyses: analyses.map(analysis => ({
        id: analysis._id,
        title: analysis.title || 'Untitled',
        platform: analysis.platform,
        contentType: analysis.contentType,
        overallScore: analysis.analysis.overallScore,
        sentiment: analysis.analysis.sentiment?.label,
        wordCount: analysis.analysis.metrics?.wordCount,
        createdAt: analysis.createdAt,
        processingTime: analysis.processingTime
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  })
);

// @route   GET /api/analyze/:id
// @desc    Get specific analysis details
// @access  Private
router.get(
  '/:id',
  auth,
  asyncHandler(async (req, res) => {
    const analysis = await ContentAnalysis.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }

    res.json({
      success: true,
      analysis: {
        id: analysis._id,
        title: analysis.title,
        content: analysis.content,
        platform: analysis.platform,
        contentType: analysis.contentType,
        analysis: analysis.analysis,
        status: analysis.status,
        processingTime: analysis.processingTime,
        createdAt: analysis.createdAt,
        updatedAt: analysis.updatedAt
      }
    });
  })
);

// @route   DELETE /api/analyze/:id
// @desc    Delete an analysis
// @access  Private
router.delete(
  '/:id',
  auth,
  asyncHandler(async (req, res) => {
    const analysis = await ContentAnalysis.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }

    res.json({
      success: true,
      message: 'Analysis deleted successfully'
    });
  })
);

// @route   GET /api/analyze/stats/overview
// @desc    Get user's analysis statistics
// @access  Private
router.get(
  '/stats/overview',
  auth,
  asyncHandler(async (req, res) => {
    const stats = await ContentAnalysis.getUserStats(req.user._id);
    
    res.json({
      success: true,
      stats: {
        totalAnalyses: stats.totalAnalyses || 0,
        averageOverallScore: Math.round(stats.avgOverallScore || 0),
        averageSentimentScore: Math.round(stats.avgSentimentScore || 0),
        averageReadabilityScore: Math.round(stats.avgReadabilityScore || 0),
        averageSeoScore: Math.round(stats.avgSeoScore || 0),
        averageEngagementScore: Math.round(stats.avgEngagementScore || 0),
        totalWordCount: stats.totalWordCount || 0,
        platformDistribution: stats.platformDistribution || []
      }
    });
  })
);

module.exports = router;