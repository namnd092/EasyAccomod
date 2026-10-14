import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
    { ignores: ['dist', 'public', 'playwright-report', 'test-results'] },
    js.configs.recommended,
    {
        files: ['**/*.{js,jsx}'],
        plugins: { react, 'react-hooks': reactHooks },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: { ecmaFeatures: { jsx: true } },
            globals: { ...globals.browser },
        },
        settings: { react: { version: 'detect' } },
        rules: {
            'react/jsx-uses-vars': 'error',
            'react/jsx-uses-react': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'no-console': 'error',
            'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^React$', caughtErrors: 'none' }],
        },
    },
    {
        files: ['**/*.test.{js,jsx}', 'src/setupTests.js'],
        languageOptions: { globals: { ...globals.browser, ...globals.vitest } },
    },
    {
        files: ['e2e/**', 'playwright.config.js', 'vite.config.js', 'eslint.config.js'],
        languageOptions: { globals: { ...globals.node } },
    },
];
