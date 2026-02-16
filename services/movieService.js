/**
 * Movie Service
 * Business logic for TMDB API interactions
 * Centralized service following separation of concerns
 */

const axios = require('axios');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Search movies/TV shows based on various criteria
 * @param {Object} params - Search parameters
 * @returns {Promise<Object>} TMDB API response
 */
const searchMovies = async ({ query, genre, isFree, page = 1 }) => {
    let apiUrl = `${TMDB_BASE_URL}/trending/all/day`;
    let params = { api_key: TMDB_API_KEY, page };

    if (query) {
        // Search by query
        apiUrl = `${TMDB_BASE_URL}/search/multi`;
        params.query = query;
    } else if (isFree) {
        // Filter free movies
        apiUrl = `${TMDB_BASE_URL}/discover/movie`;
        params.with_watch_monetization_types = 'free|ads';
        params.watch_region = 'US';
        params.sort_by = 'popularity.desc';
    } else if (genre) {
        // Filter by genre
        apiUrl = `${TMDB_BASE_URL}/discover/movie`;
        params.with_genres = genre;
        params.sort_by = 'popularity.desc';
    }

    const response = await axios.get(apiUrl, { params });
    return response.data;
};

/**
 * Get watch providers for a movie/TV show
 * @param {number} movieId - Movie/TV show ID
 * @param {string} type - 'movie' or 'tv'
 * @returns {Promise<Object>} Provider information
 */
const getProviders = async (movieId, type = 'movie') => {
    const response = await axios.get(
        `${TMDB_BASE_URL}/${type}/${movieId}/watch/providers`,
        { params: { api_key: TMDB_API_KEY } }
    );

    const data = response.data.results;
    const usData = data.US || {};

    return {
        link: usData.link,
        free: usData.free || usData.ads || [],
        flatrate: usData.flatrate || [],
        rent: usData.rent || [],
    };
};

/**
 * Get trailer for a movie/TV show
 * @param {number} movieId - Movie/TV show ID
 * @param {string} type - 'movie' or 'tv'
 * @returns {Promise<Object>} Trailer information
 */
const getTrailer = async (movieId, type = 'movie') => {
    const response = await axios.get(
        `${TMDB_BASE_URL}/${type}/${movieId}/videos`,
        { params: { api_key: TMDB_API_KEY } }
    );

    const videos = response.data.results;

    // Find official trailer on YouTube
    const trailer = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer')
        || videos.find(v => v.site === 'YouTube');

    if (!trailer) {
        return null;
    }

    return { key: trailer.key };
};

/**
 * Get movie/TV show details
 * @param {number} movieId - Movie/TV show ID
 * @param {string} type - 'movie' or 'tv'
 * @returns {Promise<Object>} Movie details
 */
const getMovieDetails = async (movieId, type = 'movie') => {
    const response = await axios.get(
        `${TMDB_BASE_URL}/${type}/${movieId}`,
        { params: { api_key: TMDB_API_KEY } }
    );

    return response.data;
};

/**
 * Get trending movies/TV shows
 * @param {string} timeWindow - 'day' or 'week'
 * @returns {Promise<Object>} Trending content
 */
const getTrending = async (timeWindow = 'day') => {
    const response = await axios.get(
        `${TMDB_BASE_URL}/trending/all/${timeWindow}`,
        { params: { api_key: TMDB_API_KEY } }
    );

    return response.data;
};

module.exports = {
    searchMovies,
    getProviders,
    getTrailer,
    getMovieDetails,
    getTrending,
};
