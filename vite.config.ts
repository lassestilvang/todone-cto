import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Provide crypto shim for bcryptjs to prevent warning about Node.js crypto module
      crypto: path.resolve(__dirname, './src/shims/crypto.ts'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore the react-is warning from recharts
        if (warning.code === 'UNRESOLVED_IMPORT' && warning.message.includes('react-is')) {
          return;
        }
        warn(warning);
      },
    },
  },
});
