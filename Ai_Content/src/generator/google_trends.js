const TECH_KEYWORDS = [
    'artificial intelligence',
    'machine learning',
    'blockchain',
    'cybersecurity',
    'cloud computing',
    'data science',
    'virtual reality',
    'augmented reality',
    'internet of things',
    'robotics'
];

function getDynamicTrends(page = 1) {
    const startIdx = (page - 1) * 5;
    const keywords = TECH_KEYWORDS.slice(startIdx, startIdx + 5);
    
    return keywords.map(keyword => {
        const randomScore = Math.floor(Math.random() * 50) + 50; // 50-100
        const randomGrowth = Math.floor(Math.random() * 30) + 20; // 20-50%
        
        return {
            keyword: keyword,
            score: randomScore,
            growth: `+${randomGrowth}%`,
            description: `Create content about ${keyword} trends and developments`,
            hashtag: `#${keyword.replace(/\s+/g, '')}`
        };
    });
}

import { getRelevantCreators, suggestCreatorsForContent } from './creators_data.js';

export async function getGoogleTrends(page = 1) {
    try {
        const trends = getDynamicTrends(page);
        return trends.map(trend => {
            const creators = suggestCreatorsForContent(trend.keyword, 'Trends');
            
            return {
                hashtag: trend.hashtag,
                headline: `${trend.keyword.charAt(0).toUpperCase() + trend.keyword.slice(1)} Trends`,
                music: "Tech Trends Beat",
                content: `${trend.description}. Growing at ${trend.growth}!`,
                creators: creators,
                trendScore: trend.score,
                growth: trend.growth
            };
        });
    } catch (error) {
        console.error('Error getting trends:', error);
        const fallbackCreators = getRelevantCreators('Trends', 'tech', 2);
        return [{
            hashtag: "#TechTrends",
            headline: "Tech Trend Analysis",
            music: "Tech Trends Beat",
            content: "Analyze and present emerging technology trends",
            creators: fallbackCreators,
            trendScore: 75,
            growth: "+25%"
        }];
    }
}