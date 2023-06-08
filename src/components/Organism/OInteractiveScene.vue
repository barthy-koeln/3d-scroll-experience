<template>
  <div
    ref="element"
    class="OInterActiveScene"
  />
</template>

<script lang="ts" setup>
  import { Clock } from 'three'
  import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
  import { useResponsiveCanvas } from '@/composables/useResponsiveCanvas'
  import { useResponsiveRenderer } from '@/composables/useResponsiveRenderer'
  import { useEnvMap } from '@/composables/useEnvMap'
  import { useDefaultScene } from '@/composables/useDefaultScene'
  import { useDebuggableMaterials } from '@/composables/useDebuggableMaterials'
  import { useInteractiveGLTF } from '@/composables/useInteractiveGLTF'
  import { update as updateAllTweens } from '@tweenjs/tween.js'
  import { useTrackedPointer } from '@/composables/useTrackedPointer'
  import { useResizeListener } from '@/composables/useResizeListener'
  import { useControlsStore } from '@/state/useControlsStore'
  import { useAnimationsStore } from '@/state/useAnimationsStore'
  import { useCameraStore } from '@/state/useCameraStore'
  import { useBVHRaycaster } from '@/composables/useBVHRaycaster'

  const props = defineProps<{
    modelUrl: string,
    envMapUrl: string,
    interactiveElementNames: string[]
  }>()

  const clock = new Clock()
  const element = ref<HTMLElement>()
  const animationFrameId = ref<number|null>(null)

  const controlsStore = useControlsStore()
  const animationsStore = useAnimationsStore()
  const cameraStore = useCameraStore()

  const { canvas, updateCanvasDimensions } = useResponsiveCanvas('OInterActiveScene__canvas')
  const { renderer, updateRendererDimensions } = useResponsiveRenderer(canvas)

  const envMap = await useEnvMap(renderer, props.envMapUrl)
  const scene = useDefaultScene(envMap)

  const anisotropy = renderer.capabilities.getMaxAnisotropy()
  const {
    camera,
    cameraTarget,
    interactiveObjects
  } = await useInteractiveGLTF(props.modelUrl, props.interactiveElementNames, scene, anisotropy)

  cameraStore.setCamera(camera, 16 / 9)
  cameraStore.setCameraTarget(cameraTarget)
  cameraStore.setCanvas(canvas)

  const { raycaster, startRaycasting, stopRaycasting, updateIntersections } = useBVHRaycaster()
  const pointer = useTrackedPointer()

  useResizeListener((width: number, height: number) => {
    updateCanvasDimensions(width, height)
    updateRendererDimensions(width, height)
    cameraStore.updateCameraDimensions(width, height)
  })

  useDebuggableMaterials(scene)

  /**
   * ! do not use reactivity here
   */
  function render (time: number) {
    const delta = clock.getDelta()
    raycaster.setFromCamera(pointer, camera)

    controlsStore.currentControls?.update(time, delta)

    updateIntersections(interactiveObjects)
    updateAllTweens(time)

    renderer.render(scene, camera)
    animationFrameId.value = window.requestAnimationFrame(render)
  }

  onMounted(async () => {
    await nextTick()

    element.value?.appendChild(canvas)
    animationFrameId.value = window.requestAnimationFrame(render)
    await controlsStore.change('scroll')

    startRaycasting()
  })

  onBeforeUnmount(() => {
    if (animationFrameId.value !== null) {
      window.cancelAnimationFrame(animationFrameId.value as number)
      animationFrameId.value = null
    }

    stopRaycasting()
    animationsStore.mixer?.stopAllAction()
    controlsStore.currentControls?.stop()
    canvas.remove()
  })
</script>

<style lang="scss">
  .OInterActiveScene {
    align-items: center;
    background-color: #f4e9e2;
    display: flex;
    height: 100vh;
    justify-content: center;
    width: 100%;

    &__canvas {
      height: auto;
      inset: 0 0 0 0;
      position: absolute;
      width: 100%;
    }
  }
</style>
