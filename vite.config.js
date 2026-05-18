import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
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
        manualChunks: {
          chartjs: ['chart.js'],
          capacitor: [
            '@capacitor/core',
            '@capacitor/haptics',
            '@capacitor/status-bar',
            '@capacitor/keyboard'
          ]
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
    include: ['chart.js', '@capacitor/core']
  }
})
