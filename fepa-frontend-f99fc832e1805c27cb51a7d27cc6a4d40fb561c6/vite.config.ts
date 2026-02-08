import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: 'all',
    proxy: {
      // Khi Frontend gọi đến /api/login, Vite sẽ đẩy nó sang http://localhost:8000/api/login
      '/api': {
        target: 'http://127.0.0.1:8000', 
        changeOrigin: true,
        secure: false,
      }
    }
  }
})