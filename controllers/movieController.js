const axios = require('axios');
require('dotenv').config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

exports.searchMovies = async (req, res) => {
    const query = req.query.query;
    const genre = req.query.genre;
    const isFree = req.query.free === 'true';

    // DEBUGGING LOGS
    console.log(`DEBUG: Request - Query: "${query}", Genre: "${genre}", Free: ${isFree}`);

    try {
        let apiUrl = `${TMDB_BASE_URL}/trending/all/day`; // Default: Trending
        let params = { api_key: TMDB_API_KEY };

        if (query) {
            // Case 1: Search by Text
            apiUrl = `${TMDB_BASE_URL}/search/multi`;
            params.query = query;
        } else if (isFree) {
            // Case 3: Free Movies (Monetization = Free/Ads)
            apiUrl = `${TMDB_BASE_URL}/discover/movie`;
            params.with_watch_monetization_types = 'free|ads';
            params.watch_region = 'US'; // Required for monetization filters
            params.sort_by = 'popularity.desc';
        } else if (genre) {
            // Case 2: Filter by Genre (Discover)
            apiUrl = `${TMDB_BASE_URL}/discover/movie`;
            params.with_genres = genre;
            params.sort_by = 'popularity.desc';
        }

        const response = await axios.get(apiUrl, { params });
        res.json(response.data);

    } catch (error) {
        console.error('Error fetching data from TMDB:', error.message);
        if (error.response) {
            console.error("API details:", JSON.stringify(error.response.data));
        }
        res.status(500).json({ error: 'Failed to fetch data from TMDB' });
    }
};

exports.getProviders = async (req, res) => {
    const movieId = req.params.id;
    const type = req.query.type || 'movie';

    try {
        const response = await axios.get(`${TMDB_BASE_URL}/${type}/${movieId}/watch/providers`, {
            params: { api_key: TMDB_API_KEY }
        });

        const data = response.data.results;
        const usData = data.US || {}; // Default to US for now

        res.json({
            link: usData.link,
            free: usData.free || usData.ads || [],
            flatrate: usData.flatrate || [],
            rent: usData.rent || []
        });

    } catch (error) {
        console.error('Error fetching providers:', error.message);
        res.status(500).json({ error: 'Failed to fetch providers' });
    }
};

exports.getTrailer = async (req, res) => {
    const movieId = req.params.id;
    const type = req.query.type || 'movie'; // 'movie' or 'tv'

    try {
        const response = await axios.get(`${TMDB_BASE_URL}/${type}/${movieId}/videos`, {
            params: { api_key: TMDB_API_KEY }
        });

        const videos = response.data.results;
        // Find the "Trailer" on "YouTube"
        const trailer = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer')
            || videos.find(v => v.site === 'YouTube'); // Fallback to any video

        if (trailer) {
            res.json({ key: trailer.key });
        } else {
            res.status(404).json({ error: 'No trailer found' });
        }

    } catch (error) {
        console.error('Error fetching trailer:', error.message);
        res.status(500).json({ error: 'Failed to fetch trailer' });
    }
};
