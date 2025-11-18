import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 5000,
      host: '0.0.0.0',
      hmr: {
        clientPort: 443,
      },
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      chunkSizeWarningLimit: 1000, // Increases warning limit to 1MB
      rollupOptions: {
        output: {
          // This function splits heavy libraries into separate files
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('firebase')) {
                return 'firebase-core';
              }
              if (id.includes('pdfjs-dist') || id.includes('mammoth') || id.includes('docx')) {
                return 'document-processing'; // Groups PDF/Word tools
              }
              if (id.includes('@google/generative-ai')) {
                return 'gemini-ai';
              }
              if (id.includes('lucide') || id.includes('framer-motion')) {
                return 'ui-libs';
              }
              return 'vendor'; // All other small libs
            }
          }
        }
      }
    }
  };
});