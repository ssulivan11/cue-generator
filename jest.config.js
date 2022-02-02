const codeCoverage = {
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 60,
      functions: 50,
      lines: 80
    }
  },
  collectCoverageFrom: [
    "src/**/*.svelte",
    "!src/__tests__/**/*"
  ]
}

const jestConfig = {
  ...codeCoverage,
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
  moduleFileExtensions: ['ts', 'svelte', 'js'],
  testPathIgnorePatterns: ['node_modules'],
  testRegex: '(/__tests__/.|(\\.|/)(test|spec))\\.[jt]sx?$',
  bail: false,
  verbose: true,
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!svelte-navigator)'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  setupFiles: ["./src/__tests__/helpers/mock.js"]
};

module.exports = jestConfig;
 