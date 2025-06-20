import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 监听所有地址
    port: 5173, // 自定义端口
    open: true, // 自动打开浏览器
  },
  base: '/videolist/',
})
