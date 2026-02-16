const Joi = require('joi');
const { ValidationError } = require('../utils/errors');

// Schema for Search Endpoint
const searchSchema = Joi.object({
    query: Joi.string().allow('').max(100).optional().messages({
        'string.max': 'Search query is too long'
    }),
    genre: Joi.string().pattern(/^[0-9]+$/).optional(),
    // We allow other internal params if any, or use .unknown(true) if we want to be loose
}).unknown(true);

// Schema for Trailer Endpoint parameters
const trailerParamSchema = Joi.object({
    id: Joi.number().integer().required()
});

const trailerQuerySchema = Joi.object({
    type: Joi.string().valid('movie', 'tv').default('movie')
}).unknown(true);

// Generic validator function
const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        const { error } = schema.validate(req[source]);
        if (error) {
            const message = error.details.map(detail => detail.message).join(', ');
            return next(new ValidationError(message));
        }
        next();
    };
};

exports.validateSearch = validate(searchSchema, 'query');

exports.validateTrailer = (req, res, next) => {
    // Validate request params (ID)
    const paramValidation = trailerParamSchema.validate(req.params);
    if (paramValidation.error) {
        return next(new ValidationError("Invalid Movie ID"));
    }

    // Validate request query (Type)
    const queryValidation = trailerQuerySchema.validate(req.query);
    if (queryValidation.error) {
        const message = queryValidation.error.details.map(d => d.message).join(', ');
        return next(new ValidationError(message));
    }

    next();
};

// Authentication Validation Schemas
const registerSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email',
        'any.required': 'Email is required'
    }),
    username: Joi.string().alphanum().min(3).max(30).required().messages({
        'string.alphanum': 'Username must contain only letters and numbers',
        'string.min': 'Username must be at least 3 characters',
        'string.max': 'Username must be less than 30 characters',
        'any.required': 'Username is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'Password is required'
    }),
    role: Joi.string().valid('FREE', 'PREMIUM').default('FREE').optional()
});

const loginSchema = Joi.object({
    emailOrUsername: Joi.string().required().messages({
        'any.required': 'Email or username is required'
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required'
    })
});

const updateProfileSchema = Joi.object({
    firstName: Joi.string().max(50).optional(),
    lastName: Joi.string().max(50).optional(),
    avatar: Joi.string().uri().optional()
}).min(1);

// Watchlist/Favorites Validation
const watchlistSchema = Joi.object({
    movieId: Joi.number().integer().required(),
    movieType: Joi.string().valid('movie', 'tv').required(),
    title: Joi.string().required(),
    posterPath: Joi.string().allow('', null).optional(),
    overview: Joi.string().allow('', null).optional()
});

// Review Validation
const reviewSchema = Joi.object({
    movieId: Joi.number().integer().required(),
    movieType: Joi.string().valid('movie', 'tv').required(),
    content: Joi.string().min(10).max(1000).required().messages({
        'string.min': 'Review must be at least 10 characters',
        'string.max': 'Review must be less than 1000 characters'
    }),
    movieTitle: Joi.string().required()
});

const updateReviewSchema = Joi.object({
    content: Joi.string().min(10).max(1000).required()
});

// Rating Validation
const ratingSchema = Joi.object({
    movieId: Joi.number().integer().required(),
    movieType: Joi.string().valid('movie', 'tv').required(),
    rating: Joi.number().min(0).max(10).required().messages({
        'number.min': 'Rating must be at least 0',
        'number.max': 'Rating must be at most 10'
    })
});

// Export validators
exports.validateRegister = validate(registerSchema);
exports.validateLogin = validate(loginSchema);
exports.validateUpdateProfile = validate(updateProfileSchema);
exports.validateWatchlist = validate(watchlistSchema);
exports.validateFavorite = validate(watchlistSchema); // Same schema as watchlist
exports.validateReview = validate(reviewSchema);
exports.validateUpdateReview = validate(updateReviewSchema);
exports.validateRating = validate(ratingSchema);
