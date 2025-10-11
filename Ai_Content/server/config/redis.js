const redis = require('redis');

let redisClient = null;

const connectRedis = async () => {
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          console.warn('Redis server refused connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          console.error('Redis retry time exhausted');
          return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
          console.error('Redis connection attempts exhausted');
          return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
      }
    });

    redisClient.on('error', (err) => {
      console.warn('Redis Client Error:', err.message);
    });

    redisClient.on('connect', () => {
      console.log('🔗 Redis Connected');
    });

    redisClient.on('ready', () => {
      console.log('⚡ Redis Ready');
    });

    redisClient.on('end', () => {
      console.log('Redis connection ended');
    });

    await redisClient.connect();
    
    // Test the connection
    await redisClient.ping();
    
    return redisClient;
  } catch (error) {
    console.warn('Redis connection failed:', error.message);
    console.warn('🚫 Running without Redis cache');
    return null;
  }
};

// Cache helper functions
const cache = {
  // Get value from cache
  get: async (key) => {
    if (!redisClient) return null;
    try {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.warn('Cache get error:', error.message);
      return null;
    }
  },

  // Set value in cache with TTL
  set: async (key, value, ttl = 3600) => {
    if (!redisClient) return false;
    try {
      await redisClient.setEx(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('Cache set error:', error.message);
      return false;
    }
  },

  // Delete from cache
  del: async (key) => {
    if (!redisClient) return false;
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.warn('Cache delete error:', error.message);
      return false;
    }
  },

  // Delete multiple keys matching pattern
  delPattern: async (pattern) => {
    if (!redisClient) return false;
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
      return true;
    } catch (error) {
      console.warn('Cache delete pattern error:', error.message);
      return false;
    }
  },

  // Check if key exists
  exists: async (key) => {
    if (!redisClient) return false;
    try {
      return await redisClient.exists(key);
    } catch (error) {
      console.warn('Cache exists error:', error.message);
      return false;
    }
  },

  // Increment counter
  incr: async (key, increment = 1) => {
    if (!redisClient) return null;
    try {
      return await redisClient.incrBy(key, increment);
    } catch (error) {
      console.warn('Cache increment error:', error.message);
      return null;
    }
  },

  // Get TTL of key
  ttl: async (key) => {
    if (!redisClient) return null;
    try {
      return await redisClient.ttl(key);
    } catch (error) {
      console.warn('Cache TTL error:', error.message);
      return null;
    }
  },

  // Add to set
  sadd: async (key, ...members) => {
    if (!redisClient) return false;
    try {
      await redisClient.sAdd(key, members);
      return true;
    } catch (error) {
      console.warn('Cache set add error:', error.message);
      return false;
    }
  },

  // Get set members
  smembers: async (key) => {
    if (!redisClient) return [];
    try {
      return await redisClient.sMembers(key);
    } catch (error) {
      console.warn('Cache set members error:', error.message);
      return [];
    }
  },

  // Remove from set
  srem: async (key, ...members) => {
    if (!redisClient) return false;
    try {
      await redisClient.sRem(key, members);
      return true;
    } catch (error) {
      console.warn('Cache set remove error:', error.message);
      return false;
    }
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  if (redisClient) {
    await redisClient.quit();
    console.log('Redis connection closed through app termination');
  }
});

module.exports = {
  connectRedis,
  cache,
  getRedisClient: () => redisClient
};