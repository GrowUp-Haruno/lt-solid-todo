import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [solidPlugin(), VitePWA({}), tsconfigPaths()],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
});
