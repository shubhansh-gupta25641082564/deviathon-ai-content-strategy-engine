// Platform-specific content generators
import { getYouTubeData } from './youtube_shorts';
import { getRedditData } from './reddit_data';
import { getGoogleTrends } from './google_trends';
import { getHackerNews } from './hacker_news';

const ITEMS_PER_PAGE = 5;

const defaultContent = {
    'YouTube': {
        hashtag: "#TechTutorials",
        headline: "Tech Tutorial Series",
        music: "Epic Technology Beat",
        content: "Create engaging tech tutorials under 60 seconds"
    },
    'Instagram': {
        hashtag: "#TechGram",
        headline: "Tech Innovation Showcase",
        music: "Digital Dreams",
        content: "Share daily tech tips and innovations through eye-catching reels"
    },
    'Trends': {
        hashtag: "#TechTrends2025",
        headline: "Future Tech Insights",
        music: "Future Forward",
        content: "Analyze and present upcoming technology trends in an engaging format"
    },
    'News': {
        hashtag: "#TechNews",
        headline: "Breaking Tech Updates",
        music: "News Background",
        content: "Cover the latest technology news and developments in short form"
    },
    'Reddit': {
        hashtag: "#RedditTech",
        headline: "Tech Community Insights",
        music: "Reddit Vibes",
        content: "Create discussion-worthy content based on trending tech subreddits"
    }
};

export const generatePlatformContent = async (platform, page = 1) => {
    try {
        let result = [];

        switch (platform) {
            case 'YouTube':
                try {
                    result = await getYouTubeData(page);
                    console.log('YouTube data fetched:', result);
                } catch (error) {
                    console.error('YouTube API error:', error);
                    result = [defaultContent.YouTube];
                }
                break;

            case 'Reddit':
                try {
                    result = await getRedditData(page);
                    console.log('Reddit data fetched:', result);
                } catch (error) {
                    console.error('Reddit API error:', error);
                    result = [defaultContent.Reddit];
                }
                break;

            case 'Trends':
                try {
                    result = await getGoogleTrends(page);
                    console.log('Trends data fetched:', result);
                } catch (error) {
                    console.error('Trends API error:', error);
                    result = [defaultContent.Trends];
                }
                break;

            case 'News':
                try {
                    result = await getHackerNews(page);
                    console.log('News data fetched:', result);
                } catch (error) {
                    console.error('News API error:', error);
                    result = [defaultContent.News];
                }
                break;

            case 'Instagram':
                // For Instagram, we generate creative content ideas with creators
                const { getRelevantCreators } = await import('./creators_data.js');
                result = Array(ITEMS_PER_PAGE).fill(null).map((_, i) => {
                    const creators = getRelevantCreators('Instagram', 'tech', 2);
                    
                    return {
                        hashtag: "#TechInsta",
                        headline: `Tech Innovation Showcase #${i + 1}`,
                        music: "Digital Innovation Beat",
                        content: [
                            "Create a tech transformation reel showing before/after",
                            "Share a step-by-step tech tip carousel",
                            "Demo an impressive tech feature in action",
                            "Show your tech workspace setup and optimization",
                            "Present a life-changing tech hack"
                        ][i],
                        creators: creators
                    };
                });
                break;

            default:
                result = [defaultContent[platform] || defaultContent.YouTube];
        }

        // Ensure we have content
        if (!result || result.length === 0) {
            result = [defaultContent[platform] || defaultContent.YouTube];
        }

        // If we have one item, generate variations to fill the page
        if (result.length === 1) {
            const baseItem = result[0];
            result = Array(ITEMS_PER_PAGE).fill(null).map((_, i) => ({
                ...baseItem,
                headline: `${baseItem.headline} ${i + 1}`,
                content: `${baseItem.content} (Variation ${i + 1})`
            }));
        }

        // Ensure proper format for all items
        return result.map(item => ({
            hashtag: item.hashtag || defaultContent[platform].hashtag,
            headline: item.headline || defaultContent[platform].headline,
            music: item.music || defaultContent[platform].music,
            content: item.content || defaultContent[platform].content
        }));

    } catch (error) {
        console.error('Error in generatePlatformContent:', error);
        const defaultItem = defaultContent[platform] || defaultContent.YouTube;
        return Array(ITEMS_PER_PAGE).fill(null).map((_, i) => ({
            ...defaultItem,
            headline: `${defaultItem.headline} ${i + 1}`,
            content: `${defaultItem.content} (Variation ${i + 1})`
        }));
    }
};

// Enhanced performance metrics generator with realistic platform-specific variations
export const generatePerformanceMetrics = async (platform) => {
    const baseMetrics = {
        YouTube: { likes: 65, shares: 35, views: 80, comments: 20 },
        Instagram: { likes: 75, shares: 45, views: 70, comments: 25 },
        Trends: { likes: 55, shares: 30, views: 60, comments: 15 },
        News: { likes: 45, shares: 25, views: 50, comments: 20 },
        Reddit: { likes: 70, shares: 40, views: 65, comments: 30 }
    }[platform] || { likes: 50, shares: 30, views: 55, comments: 20 };

    // Add some random variation (±10%)
    const randomize = (value) => {
        const variation = value * 0.2 * (Math.random() - 0.5); // ±10%
        return Math.min(100, Math.max(0, Math.round(value + variation)));
    };

    return {
        likes: randomize(baseMetrics.likes),
        shares: randomize(baseMetrics.shares),
        views: randomize(baseMetrics.views),
        comments: randomize(baseMetrics.comments)
    };
};