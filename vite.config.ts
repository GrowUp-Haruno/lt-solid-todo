import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';
import manifest from './manifest.json';

export default defineConfig({
  plugins: [
    solidPlugin(),
    VitePWA({
      manifest: manifest,
      includeAssets: ['robots.txt', 'icons/*.{png,ico}'],
    }),
    tsconfigPaths(),
  ],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
});
