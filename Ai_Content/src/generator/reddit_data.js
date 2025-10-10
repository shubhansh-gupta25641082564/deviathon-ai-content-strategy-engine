const CLIENT_ID = '2ipIxgQZ2YrzH5ooQvRshA';
const CLIENT_SECRET = 'tzC7p9LLWTaQ3yRh6oh1CoTFB8iEQQ';
const USER_AGENT = 'test_data 1.0 by /u/Temporary-Theme-1728';
const ITEMS_PER_PAGE = 5;

async function getRedditAccessToken() {
    try {
        const tokenUrl = 'https://www.reddit.com/api/v1/access_token';
        // Browser-compatible base64 encoding
        const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

        const body = new URLSearchParams();
        body.append('grant_type', 'client_credentials');
        body.append('scope', 'read');

        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': USER_AGENT
            },
            body
        });

        if (!response.ok) throw new Error(`Failed to get access token: ${response.status}`);
        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Reddit access token error:', error);
        return null;
    }
}

async function fetchRedditPosts(accessToken, subreddit) {
    try {
        const url = `https://oauth.reddit.com/r/${subreddit}/hot?limit=10`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'User-Agent': USER_AGENT
            }
        });

        if (!response.ok) throw new Error(`Failed to fetch posts: ${response.status}`);
        const data = await response.json();
        return data.data.children.map(child => child.data);
    } catch (error) {
        console.error(`Error fetching Reddit posts for r/${subreddit}:`, error);
        return [];
    }
}

export async function getRedditData(page = 1) {
    console.log('Getting Reddit data, page:', page);
    
    // Import creators data at the top level
    const { getRelevantCreators, suggestCreatorsForContent } = await import('./creators_data.js');

    // Generate fallback content immediately for CORS/API issues
    const fallbackContent = Array.from({ length: ITEMS_PER_PAGE }, (_, i) => {
        const techTopics = [
            'JavaScript Development Tips',
            'React Best Practices',
            'Python Data Science',
            'Web Development Trends',
            'AI Programming Guide',
            'Full Stack Development',
            'Mobile App Development',
            'Cloud Computing Basics',
            'DevOps Automation',
            'Cybersecurity Trends'
        ];
        
        const topicIndex = ((page - 1) * ITEMS_PER_PAGE + i) % techTopics.length;
        const topic = techTopics[topicIndex];
        const creators = suggestCreatorsForContent(topic, 'Reddit');
        
        return {
            hashtag: `#${['programming', 'technology', 'webdev', 'coding', 'javascript'][i % 5]}`,
            headline: topic,
            music: "Tech Community Mix",
            content: `Trending discussion about ${topic.toLowerCase()}. Join the conversation and share your insights!`,
            score: Math.floor(Math.random() * 1000) + 100,
            comments: Math.floor(Math.random() * 50) + 10,
            url: `https://reddit.com/r/programming`,
            creators: creators
        };
    });

    try {
        // Tech-focused subreddits
        const techSubreddits = ['programming', 'technology', 'webdev', 'coding', 'javascript'];
        const startIdx = (page - 1) * ITEMS_PER_PAGE;

        const accessToken = await getRedditAccessToken();
        if (!accessToken) {
            console.log('Using fallback Reddit content due to auth failure');
            return fallbackContent;
        }

        // Get posts from two random subreddits to ensure we have enough content
        const subreddit1 = techSubreddits[Math.floor(Math.random() * techSubreddits.length)];
        const subreddit2 = techSubreddits[Math.floor(Math.random() * techSubreddits.length)];

        const [posts1, posts2] = await Promise.all([
            fetchRedditPosts(accessToken, subreddit1),
            fetchRedditPosts(accessToken, subreddit2)
        ]);

        // Combine and transform posts
        const allPosts = [...posts1, ...posts2]
            .sort((a, b) => b.score - a.score) // Sort by score
            .map(post => {
                const creators = suggestCreatorsForContent(post.title, 'Reddit');
                
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
                    creators: creators
                };
            });

        // Return paginated results or fallback if not enough content
        const paginatedResults = allPosts.slice(startIdx, startIdx + ITEMS_PER_PAGE);
        return paginatedResults.length > 0 ? paginatedResults : fallbackContent;
    } catch (error) {
        console.error('Reddit data error:', error);
        console.log('Using fallback Reddit content');
        return fallbackContent;
    }
}