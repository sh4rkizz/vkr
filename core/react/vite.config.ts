// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

const BundleLocations = {
    mainPage: path.resolve(__dirname, 'src/pages/main/index'),
    // loginPage: path.resolve(__dirname, 'src/pages/login/index'),
    tutorPage: path.resolve(__dirname, 'src/pages/tutor/index'),
    // managementAnalyticPage: path.resolve(__dirname, 'src/pages/management-analytic/index'),
};

export default defineConfig({
    optimizeDeps: {
        esbuildOptions: {
            define: {
                global: 'globalThis',
            },
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    process: true,
                    buffer: true,
                }),
            ],
        },
    },
    plugins: [
        react({
            plugins: [
                [
                    '@swc/plugin-styled-components',
                    {
                        displayName: true, // Показывать имена компонентов в DevTools
                        ssr: false,
                        fileName: false,
                        minify: true, // Минимизировать имена классов
                    },
                ],
            ],
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        cors: true,
        hmr: {
            protocol: 'ws',
            host: 'localhost',
        },
    },
    build: {
        outDir: '../static/react',
        minify: 'terser',
        rollupOptions: {
            input: BundleLocations,
            output: {
                entryFileNames: '[name].min.js',
                chunkFileNames: '[name]-[hash].js',
                assetFileNames: '[name]-[hash][extname]',
            },
        },
    },
    css: {
        modules: {
            localsConvention: 'camelCase',
        },
    },
});
