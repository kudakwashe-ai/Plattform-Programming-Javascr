const Joi = require('joi');

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

exports.validateSearch = (req, res, next) => {
    const { error } = searchSchema.validate(req.query);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

exports.validateTrailer = (req, res, next) => {
    // Validate request params (ID)
    const paramValidation = trailerParamSchema.validate(req.params);
    if (paramValidation.error) {
        return res.status(400).json({ error: "Invalid Movie ID" });
    }

    // Validate request query (Type)
    const queryValidation = trailerQuerySchema.validate(req.query);
    if (queryValidation.error) {
        return res.status(400).json({ error: queryValidation.error.details[0].message });
    }

    next();
};
