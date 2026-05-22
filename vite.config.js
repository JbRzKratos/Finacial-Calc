import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'remove-crossorigin-from-css',
      transformIndexHtml(html) {
        // Strip the crossorigin attribute specifically from rel="stylesheet" link tags
        // Rolldown/Vite renders it as <link rel="stylesheet" crossorigin href="...css">
        return html.replace(
          /<link rel="stylesheet" crossorigin href="(.*?)">/g,
          '<link rel="stylesheet" href="$1">'
        );
      },
    },
    {
      name: 'generate-404',
      // Cloudflare Pages serves 404.html for any path that doesn't match a real static file.
      // This is the official SPA routing strategy — avoids the infinite-loop _redirects issue.
      closeBundle() {
        const src = path.resolve(__dirname, 'dist/index.html');
        const dest = path.resolve(__dirname, 'dist/404.html');
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
        }
      },
    },
  ],
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
