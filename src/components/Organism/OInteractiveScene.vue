<template>
  <div
    ref="element"
    class="OInterActiveScene"
    @pointerdown.passive="onPointerDown"
    @pointerup.passive="onPointerUp"
  />
</template>

<script lang="ts" setup>
  import type { Object3D } from 'three'
  import { Clock } from 'three'
  import { inject, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
  import { useResponsiveCanvas } from '@/composables/useResponsiveCanvas'
  import { useResponsiveRenderer } from '@/composables/useResponsiveRenderer'
  import { useEnvMap } from '@/composables/useEnvMap'
  import { useDefaultScene } from '@/composables/useDefaultScene'
  import { useDebuggableMaterials } from '@/composables/useDebuggableMaterials'
  import { useInteractiveGLTF } from '@/composables/useInteractiveGLTF'
  import { update as updateAllTweens } from '@tweenjs/tween.js'
  import { useTrackedPointer } from '@/composables/useTrackedPointer'
  import { useClickWithoutDragging } from '@/composables/useClickWithoutDragging'
  import { useResizeListener } from '@/composables/useResizeListener'
  import { CameraOperator, CameraOperatorService } from '@/services/CameraOperator'
  import { AnimationDirector, AnimationDirectorService } from '@/services/AnimationDirector'
  import { useControlsStore } from '@/state/useControlsStore'

  const props = defineProps<{
    modelUrl: string,
    envMapUrl: string
  }>()

  const emit = defineEmits<{
    'update:is-interactive': [value: boolean],
    'update:hover': [value: null|Object3D],
    'click': [event: MouseEvent]
  }>()

  const clock = new Clock()
  const element = ref<HTMLElement>()
  const animationFrameId = ref<number|null>(null)
  const controlsStore = useControlsStore()

  const { canvas, updateCanvasDimensions } = useResponsiveCanvas('OInterActiveScene__canvas')
  const { renderer, updateRendererDimensions } = useResponsiveRenderer(canvas)

  const envMap = await useEnvMap(renderer, props.envMapUrl)
  const scene = useDefaultScene(envMap)

  const anisotropy = renderer.capabilities.getMaxAnisotropy()
  const {
    camera,
    cameraTarget,
    interactiveObjects
  } = await useInteractiveGLTF(props.modelUrl, [], scene, anisotropy)

  const animationDirector = inject<AnimationDirector>(AnimationDirectorService)
  const cameraOperator = inject<CameraOperator>(CameraOperatorService)
  cameraOperator?.setCamera(camera, 16 / 9)
  cameraOperator?.setCameraTarget(cameraTarget)
  cameraOperator?.setCanvas(canvas)
  cameraOperator?.addDirectLighting()

  // const { raycaster, updateIntersections } = useBVHRaycaster((value) => emit('update:hover', value))
  const pointer = useTrackedPointer()

  const { onPointerUp, onPointerDown } = useClickWithoutDragging((event: MouseEvent) => emit('click', event))

  useResizeListener((width: number, height: number) => {
    updateCanvasDimensions(width, height)
    updateRendererDimensions(width, height)
    cameraOperator?.updateCameraDimensions(width, height)
  })

  useDebuggableMaterials(scene)

  /**
   * ! do not use reactivity here
   */
  function render (time: number) {
    const delta = clock.getDelta()
    // raycaster.setFromCamera(pointer, camera)

    controlsStore?.update(time, delta)

    // updateIntersections(interactiveObjects, props.hoverObject)
    updateAllTweens(time)

    renderer.render(scene, camera)
    animationFrameId.value = window.requestAnimationFrame(render)
  }

  onMounted(async () => {
    await nextTick()
    element.value?.appendChild(canvas)
    animationFrameId.value = window.requestAnimationFrame(render)
    controlsStore?.start()
  })

  onBeforeUnmount(() => {
    if (animationFrameId.value !== null) {
      window.cancelAnimationFrame(animationFrameId.value as number)
      animationFrameId.value = null
    }

    animationDirector?.stopAnimation()
    controlsStore?.stop()
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
