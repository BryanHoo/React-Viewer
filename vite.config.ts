import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
// @ts-expect-error vite config uses nodejs apis
import path from 'path';
// @ts-expect-error vite config uses nodejs apis
import { fileURLToPath } from 'url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      // @ts-expect-error import.meta.url is valid in ESM
      { find: '@', replacement: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src') },
    ],
  },
});
