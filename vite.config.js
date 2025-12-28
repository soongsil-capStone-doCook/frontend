import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0", // 네트워크 접근 허용
    port: 5173,
    strictPort: false, // 포트가 사용 중이면 다른 포트 사용
    hmr: {
      clientPort: 5173, // HMR 클라이언트 포트
    },
    proxy: {
      // /api로 시작하는 요청을 백엔드로 프록시
      "/api": {
        target: "http://13.209.189.41:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // /api 제거
        secure: false,
      },
    },
  },
});
