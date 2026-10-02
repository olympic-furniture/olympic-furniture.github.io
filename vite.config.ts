import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { furnitureContentPlugin } from './scripts/content-plugin.ts';

export default defineConfig({
  plugins: [furnitureContentPlugin(), react(), tailwindcss()],
  test: { environment: 'jsdom', setupFiles: ['./src/test/setup.ts'] },
});
