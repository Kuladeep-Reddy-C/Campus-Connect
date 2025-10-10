import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  envDir:"./",
  server: {
    host: 'localhost', // Force Vite to use 'localhost'
    port: 5173,
  },
})
