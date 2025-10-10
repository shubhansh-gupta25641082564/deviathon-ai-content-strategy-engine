import api from './auth.service';

export const fetchTrends = async (platform, page = 1, interest = 'All', sortBy = 'trending') => {
    try {
        const response = await api.get('/content/trends', {
            params: {
                platform,
                page,
                interest,
                sortBy
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const fetchTrendMetrics = async (trendId) => {
    try {
        const response = await api.get(`/content/trends/${trendId}/metrics`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const analyzeTrendKeywords = async (keywords) => {
    try {
        const response = await api.post('/content/analyze-keywords', { keywords });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};