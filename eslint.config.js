import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';

export default [
  { ignores: ['dist/**','node_modules/**','coverage/**','.wrangler/**'] },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { parser: tsParser, parserOptions: { ecmaVersion: 2022, sourceType: 'module', ecmaFeatures: { jsx: true } }, globals: { ...globals.browser, ...globals.node, describe: 'readonly', it: 'readonly', expect: 'readonly', Request: 'readonly', Response: 'readonly', RequestInfo: 'readonly', RequestInit: 'readonly', PagesFunction: 'readonly', Env: 'readonly' } },
    plugins: { '@typescript-eslint': tseslint },
    rules: { ...tseslint.configs.recommended.rules, '@typescript-eslint/no-explicit-any': 'off', '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }] }
  }
];
