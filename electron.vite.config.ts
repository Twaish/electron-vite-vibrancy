import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@shared': resolve('src/shared'),
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    assetsInclude: 'src/renderer/assets/**',
    resolve: {
      alias: {
        '@/components': resolve('src/renderer/src/components'),
        '@/assets': resolve('src/renderer/src/assets'),
        '@/lib': resolve('src/renderer/src/lib'),
        '@shared': resolve('src/shared'),
      },
    },
    plugins: [react()],
  },
})
