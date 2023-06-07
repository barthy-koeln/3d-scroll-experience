<template>
  <RouterView
    v-slot="{ Component }"
    class="App"
  >
    <template v-if="Component">
      <Transition
        appear
        mode="out-in"
        name="fade"
      >
        <KeepAlive>
          <Suspense>
            <Component :is="Component" />

            <!-- loading state -->
            <template #fallback>
              <div class="App__loading">
                <ALoadingIndicator />
              </div>
            </template>
          </Suspense>
        </KeepAlive>
      </Transition>
    </template>
  </RouterView>
</template>

<script
  lang="ts"
  setup
>
  import ALoadingIndicator from '@/components/Atom/ALoadingIndicator.vue'
  import { RouterView } from 'vue-router'
  import { CompressedGLTFLoader, CompressedGLTFLoaderService } from '@/services/CompressedGLTFLoader'
  import { CameraOperator, CameraOperatorService } from '@/services/CameraOperator'
  import { AnimationDirector, AnimationDirectorService } from '@/services/AnimationDirector'
  import { ControlsManager, ControlsManagerService } from '@/services/ControlsManager'
  import { provide } from 'vue'

  const compressedGLTFLoader = new CompressedGLTFLoader()
  const cameraOperator = new CameraOperator()
  const animationDirector = new AnimationDirector()
  const controlsManager = new ControlsManager(animationDirector, cameraOperator)

  provide(CompressedGLTFLoaderService, compressedGLTFLoader)
  provide(CameraOperatorService, cameraOperator)
  provide(AnimationDirectorService, animationDirector)
  provide(ControlsManagerService, controlsManager)
</script>

<style lang="scss">
  .App {

    &__loading {
      align-items: center;
      background-color: var(--color-dark);
      display: flex;
      height: 100%;
      justify-content: center;
      position: fixed;
      width: 100%;
    }
  }
</style>
