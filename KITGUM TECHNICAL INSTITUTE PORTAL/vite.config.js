import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/KITGUM-TECHNICAL-INSTITUTE-PORTAL/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})
