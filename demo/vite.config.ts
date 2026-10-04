import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  root: resolve(__dirname),
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: 'lumen-ds/styles.css',
        replacement: resolve(__dirname, '../src/styles/lumen.css'),
      },
      {
        find: /^lumen-ds$/,
        replacement: resolve(__dirname, '../src/index.ts'),
      },
    ],
  },
  server: {
    port: 5173,
    open: true,
  },
});
