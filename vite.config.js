import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/flowing-app/',
  plugins: [react()],
  assetsInclude: ['**/*.tif'],
  server: {
    host: true, // Listen on all local IPs
    port: 5173
  }
})
