import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Bebert Cup',
        short_name: 'BebertCup',
        theme_color: '#ffffff',
        icons: [],
      },
    }),
  ],
  server: {
    host: true,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
