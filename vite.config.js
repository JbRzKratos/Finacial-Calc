import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './app'),
    },
  },
  build: {
    target: 'es2020',
    minify: 'oxc',
    cssMinify: true,
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core — smallest possible vendor chunk
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor';
          }
          // All Radix UI primitives into one chunk
          if (id.includes('node_modules/@radix-ui/')) {
            return 'radix';
          }
          // All calculator components into a separate on-demand chunk
          if (id.includes('src/components/calculators/')) {
            return 'calculators';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})
