import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {viteElectronDev} from './plugins/vite.electron.dev'
import {viteElectronBuild} from './plugins/vite.electron.build'

// 自动引入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ template: { compilerOptions: { hoistStatic: false } } }),
    viteElectronDev(),
    viteElectronBuild(),

    AutoImport({
      imports: [
        'vue',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar'
          ]
        }
      ]
    }),
    Components({
      resolvers: [NaiveUiResolver()]
    })
  ],
  base:'./', //默认绝对路径改为相对路径 否则打包白屏
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // crypto: 'crypto-browserify',
      // os: 'os-browserify/browser',
      // path: 'path-browserify',
    }
  },
  // build: {
  //   outDir: 'dist',
  //   assetsDir: 'static',
  //   rollupOptions: {
  //     external: ['crypto', 'os', 'path'],
  //     input: 'src/main.ts',
  //     output: {
  //       format: 'iife',
  //       name: 'NSMusicS',
  //     },
  //   },
  // },
  // server: {
  //   host: '0.0.0.0', // 允许外部访问
  //   port: 5173, // 确保端口与 Docker 映射一致
  // },
})

