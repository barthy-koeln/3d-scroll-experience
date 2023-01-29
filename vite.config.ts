import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import visualizer from 'rollup-plugin-visualizer'

import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    visualizer()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
