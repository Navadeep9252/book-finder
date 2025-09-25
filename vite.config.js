import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Remove base path or set to empty for Vercel
  base: '',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Add this for better chunking
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  },
  server: {
    port: 3000
  }
})