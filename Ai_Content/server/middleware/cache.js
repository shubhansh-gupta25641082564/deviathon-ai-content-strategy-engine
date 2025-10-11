const { cache } = require('../config/redis');

// Generic cache middleware
const cacheMiddleware = (keyGenerator, ttl = 3600) => {
  return async (req, res, next) => {
    try {
      // Generate cache key
      const cacheKey = typeof keyGenerator === 'function' 
        ? keyGenerator(req) 
        : keyGenerator;

      // Try to get from cache
      const cached = await cache.get(cacheKey);
      
      if (cached) {
        console.log(`🎯 Cache hit: ${cacheKey}`);
        return res.json(cached);
      }

      console.log(`💽 Cache miss: ${cacheKey}`);

      // Store original send function
      const originalSend = res.send;
      
      // Override send to cache successful responses
      res.send = function(data) {
        if (res.statusCode === 200) {
          // Parse data if it's a string
          let parsedData;
          try {
            parsedData = typeof data === 'string' ? JSON.parse(data) : data;
          } catch (error) {
            parsedData = data;
          }
          
          // Cache the response
          cache.set(cacheKey, parsedData, ttl).catch(error => {
            console.warn('Cache set error:', error.message);
          });
        }
        
        // Call original send
        originalSend.call(this, data);
      };

      next();
    } catch (error) {
      console.warn('Cache middleware error:', error.message);
      next(); // Continue without caching
    }
  };
};

// Trends cache middleware
const trendsCacheMiddleware = cacheMiddleware(
  (req) => `trends:${req.query.platform || 'all'}:${req.query.interest || 'all'}:${req.query.sortBy || 'trending'}:${req.query.page || 1}`,
  300 // 5 minutes for trends
);

// Content analysis cache middleware (per user)
const contentCacheMiddleware = cacheMiddleware(
  (req) => {
    const content = req.body.content || '';
    const contentHash = require('crypto').createHash('md5').update(content).digest('hex');
    return `analysis:${req.user?._id || 'anonymous'}:${contentHash}`;
  },
  1800 // 30 minutes for content analysis
);

// Competitor cache middleware
const competitorCacheMiddleware = cacheMiddleware(
  (req) => `competitors:${req.user._id}:${req.query.platform || 'all'}:${req.query.category || 'all'}`,
  900 // 15 minutes for competitors
);

// Strategy cache middleware
const strategyCacheMiddleware = cacheMiddleware(
  (req) => `strategies:${req.user._id}:${req.query.type || 'all'}:${req.query.status || 'all'}`,
  600 // 10 minutes for strategies
);

// User-specific cache invalidation
const invalidateUserCache = (userId, patterns = []) => {
  return async (req, res, next) => {
    // Store original send function
    const originalSend = res.send;
    
    // Override send to invalidate cache on successful responses
    res.send = function(data) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Default patterns to invalidate
        const defaultPatterns = [
          `analysis:${userId}:*`,
          `competitors:${userId}:*`,
          `strategies:${userId}:*`,
          `user:${userId}:*`
        ];
        
        const allPatterns = [...defaultPatterns, ...patterns];
        
        // Invalidate cache patterns
        allPatterns.forEach(pattern => {
          cache.delPattern(pattern).catch(error => {
            console.warn('Cache invalidation error:', error.message);
          });
        });
      }
      
      // Call original send
      originalSend.call(this, data);
    };

    next();
  };
};

// Rate limiting with Redis
const rateLimitMiddleware = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // limit each IP to 100 requests per windowMs
    keyGenerator = (req) => req.ip,
    message = 'Too many requests from this IP, please try again later.',
    statusCode = 429,
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = options;

  return async (req, res, next) => {
    try {
      const key = `rate_limit:${keyGenerator(req)}`;
      const now = Date.now();
      const window = Math.floor(now / windowMs);
      const windowKey = `${key}:${window}`;

      // Get current count
      const current = await cache.get(windowKey) || 0;

      if (current >= max) {
        return res.status(statusCode).json({
          success: false,
          message,
          retryAfter: Math.ceil(windowMs / 1000)
        });
      }

      // Store the response to increment counter later
      const originalSend = res.send;
      
      res.send = function(data) {
        const shouldCount = !(
          (skipSuccessfulRequests && res.statusCode < 400) ||
          (skipFailedRequests && res.statusCode >= 400)
        );

        if (shouldCount) {
          cache.incr(windowKey, 1).then(() => {
            // Set expiry only on first increment
            if (current === 0) {
              cache.set(windowKey, 1, Math.ceil(windowMs / 1000));
            }
          }).catch(error => {
            console.warn('Rate limit increment error:', error.message);
          });
        }

        originalSend.call(this, data);
      };

      next();
    } catch (error) {
      console.warn('Rate limit middleware error:', error.message);
      next(); // Continue without rate limiting
    }
  };
};

// API key rate limiting
const apiKeyRateLimit = rateLimitMiddleware({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000, // 1000 requests per hour per API key
  keyGenerator: (req) => req.user?._id || req.ip,
  message: 'API rate limit exceeded. Please upgrade your plan for higher limits.'
});

// Expensive operation rate limiting
const expensiveOperationLimit = rateLimitMiddleware({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 expensive operations per minute
  keyGenerator: (req) => `expensive:${req.user?._id || req.ip}`,
  message: 'Too many expensive operations. Please wait before trying again.'
});

module.exports = {
  cacheMiddleware,
  trendsCacheMiddleware,
  contentCacheMiddleware,
  competitorCacheMiddleware,
  strategyCacheMiddleware,
  invalidateUserCache,
  rateLimitMiddleware,
  apiKeyRateLimit,
  expensiveOperationLimit
};