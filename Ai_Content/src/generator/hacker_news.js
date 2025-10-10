const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';
const ITEMS_PER_PAGE = 5;

async function fetchJson(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

async function fetchTopStoryIds() {
    return fetchJson(`${HN_API_BASE}/topstories.json`);
}

async function fetchStory(id) {
    return fetchJson(`${HN_API_BASE}/item/${id}.json`);
}

function transformStory(story) {
    if (!story) return null;

    return {
        hashtag: story.type === 'job' ? '#HNJobs' : '#HackerNews',
        headline: story.title,
        music: "Tech News Beat",
        content: story.text
            ? (story.text.length > 150 ? story.text.substring(0, 147) + '...' : story.text)
            : `Trending discussion: ${story.title}`,
        score: story.score,
        comments: story.descendants || 0,
        url: story.url || `https://news.ycombinator.com/item?id=${story.id}`
    };
}

export async function getHackerNews(page = 1) {
    try {
        // Get all top story IDs
        const storyIds = await fetchTopStoryIds();
        if (!Array.isArray(storyIds) || storyIds.length === 0) {
            throw new Error('No stories available');
        }

        // Calculate pagination
        const startIdx = (page - 1) * ITEMS_PER_PAGE;
        const endIdx = startIdx + ITEMS_PER_PAGE;
        const pageIds = storyIds.slice(startIdx, endIdx);

        // Fetch all stories for this page in parallel
        const stories = await Promise.all(
            pageIds.map(id => fetchStory(id).then(transformStory).catch(() => null))
        );

        // Filter out any null results and ensure we have the correct format
        const validStories = stories.filter(Boolean);

        if (validStories.length === 0) {
            throw new Error('No valid stories found');
        }

        return validStories;
    } catch (error) {
        console.error('Hacker News error:', error);
        // Return fallback content
        return Array.from({ length: ITEMS_PER_PAGE }, (_, i) => ({
            hashtag: "#TechNews",
            headline: `Tech Update #${i + 1}`,
            music: "Tech News Beat",
            content: "Latest technology news and insights"
        }));
    }
}