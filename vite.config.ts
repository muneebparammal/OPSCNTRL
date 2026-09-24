import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  worker: { format: 'es' },
  optimizeDeps: { exclude: ['maplibre-gl'] },
  server: {
    proxy: {
      // OpenSky's REST API doesn't send CORS headers, so the browser can't
      // call it directly — proxy through the dev server instead, which
      // isn't subject to browser CORS restrictions.
      '/opensky-api': {
        target: 'https://opensky-network.org/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/opensky-api/, ''),
      },
    },
  },
})
