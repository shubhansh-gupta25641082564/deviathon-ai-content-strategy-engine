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

async function transformStory(story) {
    if (!story) return null;

    // Import creators data
    const { suggestCreatorsForContent } = await import('./creators_data.js');
    const creators = suggestCreatorsForContent(story.title, 'News');

    return {
        hashtag: story.type === 'job' ? '#HNJobs' : '#HackerNews',
        headline: story.title,
        music: "Tech News Beat",
        content: story.text
            ? (story.text.length > 150 ? story.text.substring(0, 147) + '...' : story.text)
            : `Trending discussion: ${story.title}`,
        score: story.score,
        comments: story.descendants || 0,
        url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
        creators: creators
    };
}

export async function getHackerNews(page = 1) {
    console.log('Getting Hacker News data, page:', page);
    
    // Import creators data
    const { getRelevantCreators, suggestCreatorsForContent } = await import('./creators_data.js');

    // Generate realistic tech news fallback content
    const fallbackContent = Array.from({ length: ITEMS_PER_PAGE }, (_, i) => {
        const techNews = [
            'New JavaScript Framework Revolutionizes Web Development',
            'AI Breakthrough: GPT-5 Shows Unprecedented Capabilities',
            'Quantum Computing Reaches New Milestone',
            'Open Source Alternative to Popular Developer Tool Launched',
            'Cybersecurity Alert: New Vulnerability Discovered',
            'Cloud Computing Costs Drop by 40% This Quarter',
            'Machine Learning Model Achieves Human-Level Performance',
            'Blockchain Technology Adopted by Major Tech Company',
            'New Programming Language Gains Developer Community Support',
            'Tech Giant Announces Revolutionary Hardware Innovation'
        ];
        
        const newsIndex = ((page - 1) * ITEMS_PER_PAGE + i) % techNews.length;
        const news = techNews[newsIndex];
        const creators = getRelevantCreators('News', 'tech', 2);
        
        return {
            hashtag: "#HackerNews",
            headline: news,
            music: "Tech News Beat",
            content: `Breaking: ${news}. Stay updated with the latest developments in technology.`,
            score: Math.floor(Math.random() * 500) + 100,
            comments: Math.floor(Math.random() * 100) + 20,
            url: 'https://news.ycombinator.com',
            creators: creators
        };
    });

    try {
        // Get all top story IDs
        const storyIds = await fetchTopStoryIds();
        if (!Array.isArray(storyIds) || storyIds.length === 0) {
            console.log('Using fallback HN content - no story IDs');
            return fallbackContent;
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
            console.log('Using fallback HN content - no valid stories');
            return fallbackContent;
        }

        return validStories;
    } catch (error) {
        console.error('Hacker News error:', error);
        console.log('Using fallback HN content');
        return fallbackContent;
    }
}