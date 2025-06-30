import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

//按需引入element-plus   详情见element-plus官网
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        // 在这里可以配置全局变量、混入等
        javascriptEnabled: true, // 允许在 Less 中使用 JavaScript 表达式
      },
    },
  },
})
