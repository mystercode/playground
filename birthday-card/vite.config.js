import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/playground/',
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/deezer': {
        target: 'https://api.deezer.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/deezer/, ''),
      },
    },
  },
})
