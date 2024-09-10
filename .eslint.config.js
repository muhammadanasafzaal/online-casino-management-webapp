// eslint.config.js
import { FlatCompat } from '@eslint/eslintrc';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import htmlPlugin from 'eslint-plugin-html';
import angularPlugin from 'eslint-plugin-angular';

// Compatibility layer for `extends` functionality
const compat = new FlatCompat();

export default [
  {
    ignores: ['node_modules', 'dist', 'coverage'], // Define files/folders to ignore here
  },
  {
    files: ['*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['*.html'],
    plugins: {
      html: htmlPlugin,
    },
    processor: 'html/html-processor',
    rules: {
      // HTML specific rules
    },
  },
  ...compat.extends('eslint:recommended'),
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  ...compat.extends('plugin:angular/johnpapa'),
];
