module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  
  ignorePatterns: ['.eslintrc.js', './build'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "@typescript-eslint/align": 'off',
    "@typescript-eslint/array-type":'off',
    "@typescript-eslint/member-access": true,
    "@typescript-eslint/no-console": 'off',
    "@typescript-eslint/quotemark": [
      false,
      "single"
    ],
    "@typescript-eslint/indent": [
      true,
      "spaces",
      2
    ],
    "@typescript-eslint/semicolon": [
      true
    ],
    "@typescript-eslint/ordered-imports": 'off',
    "@typescript-eslint/object-literal-sort-keys":'off',
    "@typescript-eslint/no-trailing-whitespace":'off',
    "@typescript-eslint/no-consecutive-blank-lines": 'off',
    "@typescript-eslint/arrow-parens": 'off',
    "@typescript-eslint/no-empty":'off',
    "@typescript-eslint/class-name": 'off',
    "@typescript-eslint/import-spacing":'off',
    "@typescript-eslint/trailing-comma": false,
    "@typescript-eslint/interface-name": [
      true,
      "always-prefix"
    ],
    "@typescript-eslint/no-var-requires": false,
    "@typescript-eslint/no-shadowed-variable": false,
    "@typescript-eslint/curly": false,
    "@typescript-eslint/no-bitwise": false,
    "@typescript-eslint/no-unused-expression": false,
    "@typescript-eslint/member-ordering": false,
    "@typescript-eslint/only-arrow-functions": false,
    "@typescript-eslint/prefer-for-of": true,
    "@typescript-eslint/no-unnecessary-initializer": true,
    "@typescript-eslint/max-line-length": [
      true,
      150
    ]
  },
};
