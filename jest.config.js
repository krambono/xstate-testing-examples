/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
  testMatch: ['**/src/**/*.spec.ts', '**/src/**/*.test.ts', '**/test/**/*.test.ts', '**/test/**/*.spec.ts'],
};
