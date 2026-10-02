import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { furnitureContentPlugin } from './scripts/content-plugin.ts';
import { furnitureMetadataPlugin } from './scripts/generate-metadata.ts';

export default defineConfig({
  base: '/',
  plugins: [furnitureContentPlugin(), furnitureMetadataPlugin(), react(), tailwindcss()],
  test: { environment: 'jsdom', setupFiles: ['./src/test/setup.ts'] },
});
