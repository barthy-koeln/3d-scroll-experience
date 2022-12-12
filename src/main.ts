import App from '@/App.vue'
import '@/head.scss'
import router from '@/router'
import '@/utils/mesh-bvh'
import { createApp } from 'vue'

const app = createApp(App)

app.use(router)

app.mount('#app')
