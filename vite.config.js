import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'MathsPro',
        short_name: 'MathsPro',
        description: 'Application web de calcul mental pour lycée professionnel',
        theme_color: '#ffffff',
      }
    })
  ],
  base: './',
})
