const express = require('express');
const axios = require('axios');
const router = express.Router();

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

// Main trends endpoint
router.get('/', async (req, res) => {
  try {
    const { platform = 'YouTube', interest = 'All', sortBy = 'trending', page = 1 } = req.query;
    const itemsPerPage = 5;
    
    console.log(`Fetching real data for platform: ${platform}, page: ${page}`);
    
    let trends = [];
    
    switch (platform) {
      case 'News':
        try {
          trends = await fetchHackerNewsStories(itemsPerPage);
          console.log(`Fetched ${trends.length} Hacker News stories`);
        } catch (error) {
          console.error('Hacker News error:', error.message);
          trends = generateFallbackNews(itemsPerPage);
        }
        break;
        
      case 'Reddit':
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
        try {
          trends = await fetchYouTubeShorts('tech tutorial', itemsPerPage);
          console.log(`Fetched ${trends.length} YouTube shorts`);
        } catch (error) {
          console.error('YouTube error:', error.message);
          trends = generateFallbackYouTube(itemsPerPage);
        }
        break;
        
      case 'Trends':
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
        likes: Math.floor(Math.random() * 40) + 50,
        shares: Math.floor(Math.random() * 30) + 20,
        views: Math.floor(Math.random() * 50) + 40,
        comments: Math.floor(Math.random() * 25) + 15
      }
    }));
    
    res.json(enrichedTrends);
    
  } catch (error) {
    console.error('Trends API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch trends',
      message: error.message 
    });
  }
});

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