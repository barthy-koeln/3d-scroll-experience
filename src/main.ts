import App from '@/App.vue'
import '@/head.scss'
import router from '@/router'
import { CompressedGLTFLoaderService, compressedGLTGLoaderFactory } from '@/services/CompressedGLTFLoaderService'
import { createApp } from 'vue'

const app = createApp(App)

app
  .use(router)
  .provide(CompressedGLTFLoaderService, compressedGLTGLoaderFactory)
  .mount('#app')
