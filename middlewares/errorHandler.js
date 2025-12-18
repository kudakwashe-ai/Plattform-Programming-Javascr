const fs = require('fs');
const path = require('path');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    try {
        fs.appendFileSync(path.join(__dirname, '../error.log'), `${new Date().toISOString()} - ${err.stack}\n`);
    } catch (e) {
        console.error('Failed to write to error log', e);
    }
    res.status(500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
};

module.exports = errorHandler;