const jestConfig = {
  resolver: '<rootDir>/jestResolver.cjs',
  transform: {
    '^.+\\.svelte$': [
      'svelte-jester',
      {
        preprocess: true
      }
    ],
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest'
  },
  moduleFileExtensions: ['js', 'ts', 'svelte'],
  testPathIgnorePatterns: ['node_modules'],
  testRegex: '(/__tests__/.|(\\.|/)(test|spec))\\.[jt]sx?$',
  bail: false,
  verbose: true,
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!svelte-navigator)'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect']
};

module.exports = jestConfig;
