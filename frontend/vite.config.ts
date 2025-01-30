import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path';


const STATIC_DIRECTORY = '../../static'; // Django 'static' folder

export default defineConfig({
  plugins: [svelte()],
  build: {
    watch: {
      buildDelay: 1000,
      exclude: 'node_modules/**',
      include: 'src/**',
    },

    rollupOptions: {
      input: {
        "default": "./src/.export-css/default.scss",
        "mgmt": "./src/.export-css/mgmt.scss",

        // Pages
        "stage": "./src/.pages/stage/main.ts",
        "stage-list": "./src/.pages/stage-list/main.ts",

        // Blocks
        "header": "./src/.blocks/header/main.ts",
        "calendar": "./src/.blocks/calendar/main.ts",
        "notifications": "./src/.blocks/notifications/main.ts",
      },
      output: {
        entryFileNames: () => { return `[name]/[name].js` },
        chunkFileNames: `[name]/[name].js`,
        assetFileNames: `[name]/[name][extname]`,
        dir: path.resolve(__dirname, STATIC_DIRECTORY),
      },
    },
  },
});
