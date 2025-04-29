/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: './tsconfig.json'
    }]
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/backend/src/$1'
  },
  rootDir: './',
  testMatch: ['<rootDir>/backend/src/tests/**/*.test.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(supertest)/)'
  ]
}