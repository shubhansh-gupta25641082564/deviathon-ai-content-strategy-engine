import axios from 'axios';

const API_URL = 'http://localhost:5002/api';

// Create axios instance with base URL
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const register = async (username, email, password) => {
    try {
        const response = await api.post('/auth/register', {
            username,
            email,
            password,
        });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Call backend logout endpoint to invalidate token
    return api.post('/auth/logout');
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const updateProfile = async (updates) => {
    try {
        const response = await api.put('/auth/me', updates);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

export default api;