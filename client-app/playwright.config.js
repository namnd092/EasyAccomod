import { defineConfig } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3000';

// The API must already be running (see README); the client is served by Vite.
export default defineConfig({
    testDir: './e2e',
    fullyParallel: false,
    workers: 1,
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
    expect: { timeout: 10_000 },
    use: { baseURL, trace: 'retain-on-failure' },
    webServer: {
        command: process.env.CI
            ? 'npm run preview -- --port 3000 --strictPort'
            : 'npm run dev',
        url: baseURL,
        reuseExistingServer: true,
    },
});
