// <reference @types="vite/client" />

declare module '*.jpg'
declare module '*.png'
declare module '*.webp'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string | number | symbol, unknown>, Record<string | number | symbol, unknown>, unknown>
  export default component
}
