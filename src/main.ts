import App from '@/App.vue'
import '@/head.scss'
import router from '@/router'
import { createApp } from 'vue'

const app = createApp(App)

app
  .use(router)
  .mount('#app')
