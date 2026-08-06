import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.',
  publicDir: 'public',
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: false,
    open: false,
    allowedHosts: [
      'ga-tillo.ddns.net',
      'localhost',
      '127.0.0.1',
      '.ddns.net',
    ],
    cors: true,
    hmr: {
      host: 'localhost',
      port: 3000,
    },
    watch: {
      usePolling: true,
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': '/src',
    }
  },
  // Proteger variables de entorno
  define: {
    'process.env': {}
  }
})