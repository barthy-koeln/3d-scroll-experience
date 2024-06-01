import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    visualizer({ filename: 'dist/bundle.html' })
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'three/examples': fileURLToPath(new URL('./node_modules/three/examples', import.meta.url)),
      three: fileURLToPath(new URL('./node_modules/three/src/Three', import.meta.url))
    }
  },
  esbuild: {
    // drop: mode === 'production' ? ['console', 'debugger'] : []
  }
}))
