// jest.config.js
module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/server.js'
    ],
    setupFilesAfterEnv: ['./tests/setup.js'],
    testMatch: [
        '**/tests/**/*.test.js'
    ],
    moduleFileExtensions: ['js', 'json'],
    verbose: true
};