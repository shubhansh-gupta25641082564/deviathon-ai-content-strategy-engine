import api from './auth.service';

// Content Analysis Service
export const analyzeContent = async (content, title = '', contentType = 'other', platform = 'Other') => {
    try {
        const response = await api.post('/analyze', {
            content,
            title,
            contentType,
            platform
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getAnalysisHistory = async (page = 1, limit = 10, platform = 'All', contentType = 'all') => {
    try {
        const response = await api.get('/analyze/history', {
            params: {
                page,
                limit,
                platform,
                contentType
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getAnalysisById = async (id) => {
    try {
        const response = await api.get(`/analyze/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteAnalysis = async (id) => {
    try {
        const response = await api.delete(`/analyze/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getAnalysisStats = async () => {
    try {
        const response = await api.get('/analyze/stats/overview');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Strategy Generation Service
export const generateContentStrategy = async (data) => {
    try {
        const response = await api.post('/strategy/generate', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getStrategyHistory = async (page = 1, limit = 10) => {
    try {
        const response = await api.get('/strategy/history', {
            params: { page, limit }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Competitor Analysis Service
export const analyzeCompetitor = async (competitorUrl, analysisType = 'basic') => {
    try {
        const response = await api.post('/competitors/analyze', {
            competitorUrl,
            analysisType
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getCompetitorHistory = async (page = 1, limit = 10) => {
    try {
        const response = await api.get('/competitors/history', {
            params: { page, limit }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Platform-specific content generation
export const generatePlatformContent = async (platform, prompt, options = {}) => {
    try {
        const response = await api.post('/content/generate', {
            platform,
            prompt,
            ...options
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export default {
    analyzeContent,
    getAnalysisHistory,
    getAnalysisById,
    deleteAnalysis,
    getAnalysisStats,
    generateContentStrategy,
    getStrategyHistory,
    analyzeCompetitor,
    getCompetitorHistory,
    generatePlatformContent
};