import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { furnitureContentPlugin } from './scripts/content-plugin.ts';
import { furnitureMetadataPlugin } from './scripts/generate-metadata.ts';
import path from 'node:path';

export default defineConfig({
  base: '/',
  plugins: [furnitureContentPlugin(), furnitureMetadataPlugin(), react(), tailwindcss()],
  build: {
    rolldownOptions: {
      input: {
        main: path.resolve(process.cwd(), 'index.html'),
        woodPreview: path.resolve(process.cwd(), 'wood-preview/index.html'),
      },
    },
  },
  test: { environment: 'jsdom', setupFiles: ['./src/test/setup.ts'] },
});
