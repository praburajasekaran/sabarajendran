import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3003,
      host: '0.0.0.0',
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
    css: {
      // Ensure CSS is properly processed
      devSourcemap: true,
    },
    optimizeDeps: {
      include: ['html2canvas']
    },
    build: {
      cssCodeSplit: true, // Split CSS for better caching
      minify: 'esbuild',
      sourcemap: mode === 'development',
      commonjsOptions: {
        include: [/html2canvas/, /node_modules/]
      },
      rollupOptions: {
        external: [],
        output: {
          manualChunks: {
            'html2canvas': ['html2canvas']
          }
        }
      }
    }
  };
});
