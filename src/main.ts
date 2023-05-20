import App from '@/App.vue'
import '@/head.scss'
import router from '@/router'
import {CompressedGLTFLoader, CompressedGLTFLoaderService} from '@/services/CompressedGLTFLoader'
import {CameraOperator, CameraOperatorService} from "@/services/CameraOperator";
import {createApp} from 'vue'
import {AnimationDirector, AnimationDirectorService} from "@/services/AnimationDirector";

const app = createApp(App)

app
  .use(router)
  .provide(CompressedGLTFLoaderService, new CompressedGLTFLoader())
  .provide(CameraOperatorService, new CameraOperator())
  .provide(AnimationDirectorService, new AnimationDirector())
  .mount('#app')
