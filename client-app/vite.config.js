import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    resolve: {
        // The CJS build of each icon exposes the component as `default`, which
        // breaks default imports after Vite's dependency pre-bundling.
        alias: [
            {
                find: /^@mui\/icons-material\/(?!esm\/)(.+)$/,
                replacement: '@mui/icons-material/esm/$1',
            },
        ],
    },
    server: { port: 3000 },
    test: {
        environment: 'jsdom',
        setupFiles: './src/setupTests.js',
        globals: true,
        include: ['src/**/*.test.{js,jsx}'],
    },
});
