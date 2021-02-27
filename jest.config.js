module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>jest.setup-after-env.js'],
  testPathIgnorePatterns: [
    '<rootDir>/onboarding-mfe'
  ]
};
