module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json']
  },
  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true
  },
  plugins: ['svelte3', '@typescript-eslint'],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
     
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking'
      ],
    },
    {
      files: ['*.ts'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
     
    }
  ],
  settings: {
    'svelte3/typescript': true,
    'svelte3/ignore-styles': () => true,
  },
  ignorePatterns: ["*.js"]
};
