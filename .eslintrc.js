'use strict';

module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['import'],
  extends: ['eslint:recommended', 'plugin:import/recommended'],
  rules: {
    // ── Import hygiene ──────────────────────────────────────────────────
    // Prevent circular dependencies between modules
    'import/no-cycle': ['error', { maxDepth: 3, ignoreExternal: true }],

    // Enforce module boundary direction:
    // routes -> controller -> service -> repository -> db/client
    // No layer may import from a layer above it.
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            target: './src/db/repositories',
            from: './src/modules',
            message: 'Repositories must not import from modules (service layer).',
          },
          {
            target: './src/db/client.js',
            from: './src/modules',
            message: 'db/client must not import from modules.',
          },
          {
            target: './src/middleware',
            from: './src/modules',
            message: 'Middleware must not import from feature modules.',
          },
          {
            target: './src/config',
            from: './src/modules',
            message: 'Config must not import from feature modules.',
          },
          {
            target: './src/utils',
            from: './src/modules',
            message: 'Utils must not import from feature modules.',
          },
        ],
      },
    ],

    // ── General code style ───────────────────────────────────────────────
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-var': 'error',
    'prefer-const': 'error',
    eqeqeq: ['error', 'always'],
    curly: ['error', 'all'],
    'import/no-unresolved': 'off',
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.spec.js', 'test-utils/**'],
      rules: {
        'import/no-restricted-paths': 'off',
        'import/no-cycle': 'off',
      },
    },
  ],
};
