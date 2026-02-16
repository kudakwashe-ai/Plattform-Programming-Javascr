/**
 * Jest Configuration
 * Following best practices from Meta and Google for Node.js testing
 */

module.exports = {
    testEnvironment: 'node',
    coveragePathIgnorePatterns: ['/node_modules/'],
    testMatch: ['**/tests/**/*.test.js'],
    verbose: true,
    collectCoverageFrom: [
        'controllers/**/*.js',
        'services/**/*.js',
        'middleware/**/*.js',
        '!**/node_modules/**',
        '!**/tests/**',
    ],
    coverageThresholds: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
    testTimeout: 10000,
};
