import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './app'),
    },
  },
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.warn']
      }
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('chart.js')) return 'chartjs';
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    },
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    sourcemap: false,
    reportCompressedSize: true
  },
  optimizeDeps: {
    include: ['chart.js']
  }
})
