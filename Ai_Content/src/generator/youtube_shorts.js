const YT_API_KEY = 'AIzaSyCv0fKpWLCBJiduT2HMbtU-N_R-jWp7bbM';
const ITEMS_PER_PAGE = 5;

async function ytFetch(url, params) {
    const full = `${url}?${new URLSearchParams(params).toString()}`;
    const resp = await fetch(full, { headers: { 'Accept': 'application/json' } });
    if (!resp.ok) {
        throw new Error(`YouTube API error: ${resp.status}`);
    }
    return resp.json();
}

async function searchShorts(query, pageToken = null) {
    try {
        const data = await ytFetch('https://www.googleapis.com/youtube/v3/search', {
            key: YT_API_KEY,
            part: 'snippet',
            q: query + ' #shorts',
            type: 'video',
            maxResults: String(ITEMS_PER_PAGE),
            order: 'viewCount',
            videoDuration: 'short',
            pageToken: pageToken || ''
        });

        return data.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            url: `https://www.youtube.com/shorts/${item.id.videoId}`,
            channel: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt
        }));
    } catch (error) {
        console.error('YouTube API error:', error);
        return [{
            id: 'default',
            title: 'Tech Tutorial Tips',
            description: 'Create engaging tech tutorials',
            url: 'https://youtube.com/shorts',
            channel: 'Tech Channel',
            publishedAt: new Date().toISOString()
        }];
    }
}

export async function getYouTubeData(page = 1) {
    try {
        const shorts = await searchShorts('tech tutorial', page === 1 ? null : `page_${page}`);
        return shorts.map(video => ({
            hashtag: "#TechTutorial",
            headline: video.title,
            music: "Tech Tutorial Beat",
            content: video.description || `Create an engaging tutorial about ${video.title}`
        }));
    } catch (error) {
        console.error('Error fetching YouTube data:', error);
        return [{
            hashtag: "#TechTutorial",
            headline: "Create Tech Tutorials",
            music: "Tech Tutorial Beat",
            content: "Create engaging tech tutorials under 60 seconds"
        }];
    }
}