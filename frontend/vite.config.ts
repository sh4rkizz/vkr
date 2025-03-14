import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';


const STATIC_DIRECTORY = '../static'; // Django 'static' folder


export default defineConfig({
    plugins: [svelte()],
    resolve: {
        alias: {
            $components: path.resolve('src/components/'),

            $pages: path.resolve('src/_pages/'),
            $blocks: path.resolve('src/_blocks/'),
            $uikit: path.resolve('src/uikit/'),
            $fonts: path.resolve('src/uikit/fonts/')
        }
    },

    build: {
        watch: {
            buildDelay: 1000,
            exclude: 'node_modules/**',
            include: 'src/**',
        },

        rollupOptions: {
            input: {
                // uikit
                "mgmt/index": "./src/uikit/mgmt/page-index.scss",
                "mgmt/list": "./src/uikit/mgmt/page-list.scss",
                "mgmt/detail": "./src/uikit/mgmt/page-detail.scss",

                "mgmt/defaults": "./src/uikit/mgmt/defaults.scss",
                "core/defaults": "./src/uikit/core/defaults.scss",
                //

                // Pages
                "core/main": "./src/_pages/main/main.ts",
                //

                // Blocks
                "header": "./src/_blocks/header/main.ts",
                // "blocks/calendar": "./src/_blocks/calendar/main.svelte",
                // "notifications": "./src/_blocks/notifications/main.ts",
                //
            },
            output: {
                entryFileNames: `[name].min.js`,
                chunkFileNames: `chunks/[name].min.js`,
                assetFileNames: ({ name }) => {
                    if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
                        return 'images/[name].min.[ext]';
                    }

                    if (/\.css$/.test(name ?? '')) {
                        return '[name].min.[ext]';
                    }

                    // Для других типов файлов
                    return 'assets/[name].min.[ext]';
                },
                dir: path.resolve(__dirname, STATIC_DIRECTORY),
            },
        },
    },
});
