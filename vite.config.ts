import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import visualizer from 'rollup-plugin-visualizer'

import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    visualizer({ filename: 'dist/bundle.html' })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'three/examples': fileURLToPath(new URL('./node_modules/three/examples', import.meta.url)),
      'three': fileURLToPath(new URL('./node_modules/three/src/Three', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks (id) {
          if (id.includes('three/src/')) {
            return 'three-core'
          }

          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  }
})
