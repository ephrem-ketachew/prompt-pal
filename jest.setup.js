// Jest setup file
// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.DATABASE_URL = 'mongodb://localhost:27017/test-db';
process.env.DATABASE_PASSWORD = 'test-password';

// Mock logger to avoid console noise in tests
jest.mock('./src/config/logger.config.js', () => ({
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

