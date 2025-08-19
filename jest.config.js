module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.js',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'html-spa',
    'text-summary',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup/index.js'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/lib/', '/es/'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  moduleFileExtensions: ['js'],
  verbose: true
}
