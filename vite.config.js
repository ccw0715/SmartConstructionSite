import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'node:path'

// GitHub Pages 部署在子路径 /SmartConstructionSite/
// 本地开发使用 '/'，构建时使用子路径
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/SmartConstructionSite/' : '/',
  plugins: [
    vue(),
    AutoImport({ resolvers: [ElementPlusResolver()] }),
    Components({ resolvers: [ElementPlusResolver()] })
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') }
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    open: false
  },
  css: {
    preprocessorOptions: {
      scss: { api: 'modern-compiler' }
    }
  }
}))
