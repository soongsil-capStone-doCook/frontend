import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    host: '0.0.0.0', // 네트워크 접근 허용
    port: 5173,
    strictPort: false, // 포트가 사용 중이면 다른 포트 사용
    hmr: {
      clientPort: 5173, // HMR 클라이언트 포트
    },
  },
})
