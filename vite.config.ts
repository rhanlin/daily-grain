import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/apple-touch-icon.webp', 'icons/maskable-icon.webp'],
      manifest: {
        name: 'DailyGrain',
        short_name: 'DailyGrain',
        description: 'Master Your Time, Grain by Grain.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        icons: [
          {
            src: 'icons/icon-192x192.webp',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.webp',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icons/maskable-icon.webp',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
