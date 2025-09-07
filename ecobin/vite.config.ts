import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'EcoBin',
        short_name: 'EcoBin',
        description: 'A React + Vite Progressive Web App',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icon512_rounded.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon512_rounded.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icon512_maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})
