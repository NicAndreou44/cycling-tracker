module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js', 'json'],
    transform: {
      '^.+\\.ts$': 'ts-jest',
      
      '^.+\\.js$': 'babel-jest',
    },
   
    testMatch: ['**/tests/**/*.test.(ts|js)'],
   
    moduleNameMapper: {
     
      '../../server': '<rootDir>/server.ts'
    }
  };