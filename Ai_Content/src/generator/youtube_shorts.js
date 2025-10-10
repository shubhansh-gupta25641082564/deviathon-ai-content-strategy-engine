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

import { getRelevantCreators, suggestCreatorsForContent } from './creators_data.js';

export async function getYouTubeData(page = 1) {
    console.log('Getting YouTube data, page:', page);
    
    // Generate diverse fallback content with creators
    const fallbackContent = Array.from({ length: 5 }, (_, i) => {
        const tutorials = [
            'Build a React App in 60 Seconds',
            'JavaScript Tips That Will Blow Your Mind',
            'CSS Animation Magic Tutorial',
            'Python Data Science Quick Start',
            'Web Development Setup Guide',
            'API Integration Made Simple',
            'Database Design Principles',
            'Git Commands Every Developer Needs',
            'Mobile-First Design Tutorial',
            'Docker Basics for Beginners'
        ];
        
        const tutorialIndex = ((page - 1) * 5 + i) % tutorials.length;
        const tutorial = tutorials[tutorialIndex];
        const creators = suggestCreatorsForContent(tutorial, 'YouTube');
        
        return {
            hashtag: "#TechTutorial",
            headline: tutorial,
            music: "Tech Tutorial Beat",
            content: `Learn ${tutorial.toLowerCase()} with this quick and engaging tutorial. Perfect for busy developers!`,
            id: `tutorial-${page}-${i}`,
            url: 'https://youtube.com/shorts',
            channel: 'Tech Tutorials',
            publishedAt: new Date().toISOString(),
            creators: creators
        };
    });

    try {
        const shorts = await searchShorts('tech tutorial', page === 1 ? null : `page_${page}`);
        
        if (!shorts || shorts.length === 0) {
            console.log('Using fallback YouTube content - no results');
            return fallbackContent;
        }
        
        return shorts.map(video => {
            const creators = suggestCreatorsForContent(video.title || '', 'YouTube');
            
            return {
                hashtag: "#TechTutorial",
                headline: video.title || 'Tech Tutorial',
                music: "Tech Tutorial Beat",
                content: video.description || `Create an engaging tutorial about ${video.title}`,
                id: video.id,
                url: video.url,
                channel: video.channel,
                publishedAt: video.publishedAt,
                creators: creators
            };
        });
    } catch (error) {
        console.error('Error fetching YouTube data:', error);
        console.log('Using fallback YouTube content');
        return fallbackContent;
    }
}