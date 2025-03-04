import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(), VitePWA({
    registerType: 'autoUpdate',  // 자동 업데이트로 변경
    injectRegister: 'auto',      // 자동 등록 코드 삽입

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: 'vite-project',
      short_name: 'vite-project',
      description: 'vite-project',
      theme_color: '#ffffff',
      icons: [  // 아이콘 추가
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      skipWaiting: true,  // 새 서비스 워커가 즉시 활성화되도록 추가
    },

    devOptions: {
      enabled: true,  // 개발 환경에서도 PWA 활성화
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
})
