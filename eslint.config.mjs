// @ts-check
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';

import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');
const sharedDir = path.join(rootDir, 'shared');

export default defineConfig(
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/node_modules/**',
      'backend/eslint.config.mjs',
      'frontend/eslint.config.js',
      'eslint.config.mjs',
    ],
  },

  // ---------------------------------------------------------------------------
  // Frontend
  // ---------------------------------------------------------------------------
  {
    files: ['frontend/**/*.{ts,tsx}'],

    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      globals: globals.browser,

      parserOptions: {
        projectService: true,
        tsconfigRootDir: frontendDir,
      },
    },
    rules: {
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/backend/**'],
              message: 'Frontend must not import backend code.',
            },
          ],
        },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // Backend
  // ---------------------------------------------------------------------------
  {
    files: ['backend/**/*.ts'],

    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,

      eslintPluginPrettierRecommended,
    ],

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },

      sourceType: 'commonjs',

      parserOptions: {
        projectService: {
          allowDefaultProject: ['test/*.ts'],
        },

        tsconfigRootDir: backendDir,
      },
    },

    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',

      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',

      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/frontend/**'],
              message: 'Backend must not import frontend code.',
            },
          ],
        },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // Shared
  // ---------------------------------------------------------------------------
  {
    files: ['shared/**/*.ts'],

    extends: [eslint.configs.recommended, tseslint.configs.recommendedTypeChecked],

    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: sharedDir,
      },
    },

    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/frontend/**', '**/backend/**'],
              message: 'Shared code must not depend on frontend or backend.',
            },
          ],
        },
      ],
    },
  },
);
