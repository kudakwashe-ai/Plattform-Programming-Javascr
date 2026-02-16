/**
 * CineVault API Utility
 * Handles communication with the backend
 */

const API_BASE_URL = '/api';

const api = {
    /**
     * Generic fetch wrapper with auth token
     */
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;

        // Default headers
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    },

    /**
     * Auth Methods
     */
    auth: {
        async login(emailOrUsername, password) {
            return api.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ emailOrUsername, password })
            });
        },

        async register(userData) {
            return api.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData)
            });
        },

        async logout() {
            return api.request('/auth/logout', { method: 'POST' });
        },

        async getMe() {
            return api.request('/auth/me');
        }
    },

    /**
     * Movie Methods
     */
    movies: {
        async getTrending() {
            return api.request('/movies/trending');
        },
        async search(query) {
            return api.request(`/movies/search?query=${encodeURIComponent(query)}`);
        },
        async getTrailer(id, type = 'movie') {
            return api.request(`/movies/trailer/${id}?type=${type}`);
        },
        async getProviders(id, type = 'movie') {
            return api.request(`/movies/providers/${id}?type=${type}`);
        }
    },

    /**
     * User Methods
     */
    user: {
        async getWatchlist() {
            return api.request('/users/watchlist');
        },
        async addToWatchlist(movieData) {
            return api.request('/users/watchlist', {
                method: 'POST',
                body: JSON.stringify(movieData)
            });
        },
        async removeFromWatchlist(id, type) {
            return api.request(`/users/watchlist?movieId=${id}&movieType=${type}`, {
                method: 'DELETE'
            });
        }
    }
};

window.api = api;
