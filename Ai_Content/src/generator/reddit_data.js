const CLIENT_ID = '2ipIxgQZ2YrzH5ooQvRshA';
const CLIENT_SECRET = 'tzC7p9LLWTaQ3yRh6oh1CoTFB8iEQQ';
const USER_AGENT = 'test_data 1.0 by /u/Temporary-Theme-1728';
const ITEMS_PER_PAGE = 5;

async function getRedditAccessToken() {
    try {
        const tokenUrl = 'https://www.reddit.com/api/v1/access_token';
        const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

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
    try {
        // Tech-focused subreddits
        const techSubreddits = ['programming', 'technology', 'webdev', 'coding', 'javascript'];
        const startIdx = (page - 1) * ITEMS_PER_PAGE;

        const accessToken = await getRedditAccessToken();
        if (!accessToken) throw new Error('Failed to get Reddit access token');

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
            .map(post => ({
                hashtag: `#${post.subreddit}`,
                headline: post.title.length > 80 ? post.title.substring(0, 77) + '...' : post.title,
                music: `${post.subreddit} Community Mix`,
                content: post.selftext
                    ? (post.selftext.length > 150 ? post.selftext.substring(0, 147) + '...' : post.selftext)
                    : `Trending discussion from r/${post.subreddit}`,
                score: post.score,
                comments: post.num_comments,
                url: `https://reddit.com${post.permalink}`
            }));

        // Return paginated results
        return allPosts.slice(startIdx, startIdx + ITEMS_PER_PAGE);
    } catch (error) {
        console.error('Reddit data error:', error);
        // Return fallback content
        return Array.from({ length: ITEMS_PER_PAGE }, (_, i) => ({
            hashtag: "#TechTrends",
            headline: `Tech Insight #${i + 1}`,
            music: "Tech Community Mix",
            content: "Trending tech discussion from the Reddit community"
        }));
    }
}