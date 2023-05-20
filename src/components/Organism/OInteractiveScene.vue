<template>
  <div
    ref="element"
    class="OInterActiveScene"
    @pointerdown.passive="onPointerDown"
    @pointerup.passive="onPointerUp"
  >
  </div>
</template>

<script lang="ts" setup>
  import type {Color, Object3D} from "three";
  import {Clock} from "three";
  import {inject, nextTick, onBeforeUnmount, onMounted, ref} from "vue";
  import {useResponsiveCanvas} from "@/composables/useResponsiveCanvas";
  import {useResponsiveRenderer} from "@/composables/useResponsiveRenderer";
  import {useEnvMap} from "@/composables/useEnvMap";
  import {useDefaultScene} from "@/composables/useDefaultScene";
  import {useDebuggableMaterials} from "@/composables/useDebuggableMaterials";
  import {useInteractiveGLTF} from "@/composables/useInteractiveGLTF";
  import {update as updateAllTweens} from "@tweenjs/tween.js";
  import {useTrackedPointer} from "@/composables/useTrackedPointer";
  import {useOrbitControls} from "@/composables/useOrbitControls";
  import {useFirstPersonControls} from "@/composables/useFirstPersonControls";
  import {useClickWithoutDragging} from "@/composables/useClickWithoutDragging";
  import {useResizeListener} from "@/composables/useResizeListener";
  import {useBVHRaycaster} from "@/composables/useBVHRaycaster";
  import {CameraOperator, CameraOperatorService} from "@/services/CameraOperator";
  import type {FrameCallback} from "@/types";
  import {AnimationDirector, AnimationDirectorService} from "@/services/AnimationDirector";

  const props = withDefaults(
    defineProps<{
      modelUrl: string,
      envMapUrl?: string,
      interactiveElementNames?: string[],
      hoverObject?: Object3D|null,
      activeObject?: Object3D|null,
      hoverColor?: Color|null,
      frameCallback?: FrameCallback|null
    }>(),
    {
      envMapUrl: '/envmap/brown_photostudio_02_1k.hdr',
      interactiveElementNames: () => [],
      hoverObject: null,
      activeObject: null,
      hoverColor: null,
      frameCallback: null
    }
  )

  const emit = defineEmits<{
    'update:hover': [value: null|Object3D],
    'click': [event: MouseEvent],
    'frame': []
  }>()

  const clock = new Clock()
  const element = ref<HTMLElement>()
  const animationFrameId = ref<number|null>(null)

  const { canvas, updateCanvasDimensions } = useResponsiveCanvas('OInterActiveScene__canvas')
  const { renderer, updateRendererDimensions } = useResponsiveRenderer(canvas)

  const envMap = await useEnvMap(renderer, props.envMapUrl)
  const scene = useDefaultScene(envMap)

  const anisotropy = renderer.capabilities.getMaxAnisotropy()
  const {
    camera,
    cameraTarget,
    interactiveObjects,
  } = await useInteractiveGLTF(props.modelUrl, props.interactiveElementNames, scene, anisotropy)

  const animationDirector = inject<AnimationDirector>(AnimationDirectorService)

  const cameraOperator = inject<CameraOperator>(CameraOperatorService)
  cameraOperator?.setActiveCamera(camera, 16 / 9)
  cameraOperator?.setCameraTarget(cameraTarget)
  cameraOperator?.addDirectLighting()

  const getObjectByName = scene.getObjectByName.bind(scene)

  const { raycaster, updateIntersections } = useBVHRaycaster((value) => emit('update:hover', value))
  const pointer = useTrackedPointer()
  const {startOrbitControls, stopOrbitControls, orbitControls} = useOrbitControls(camera, cameraTarget, canvas)
  const {startFPSControls, stopFPSControls, firstPersonControls} = useFirstPersonControls(camera, cameraTarget, canvas)
  const {onPointerUp, onPointerDown} = useClickWithoutDragging((event: MouseEvent) => emit('click', event))

  useResizeListener((width: number, height: number) => {
    updateCanvasDimensions(width, height)
    updateRendererDimensions(width, height)
    cameraOperator?.updateCameraDimensions(width, height)
  })

  defineExpose({
    startOrbitControls,
    stopOrbitControls,
    orbitControls,
    startFPSControls,
    stopFPSControls,
    firstPersonControls,
    getObjectByName
  })

  useDebuggableMaterials(scene)

  /**
   * ! do not use reactivity here
   */
  function render (time: number) {
    const delta = clock.getDelta()
    raycaster.setFromCamera(pointer, camera)

    orbitControls.value?.enabled && orbitControls.value.update()
    firstPersonControls?.enabled && firstPersonControls.update(delta)

    updateIntersections(interactiveObjects, props.hoverObject)
    updateAllTweens(time)

    props.frameCallback?.(time, delta)
    renderer.render(scene, camera)
    animationFrameId.value = window.requestAnimationFrame(render)
  }

  onMounted(async () => {
    await nextTick()
    element.value?.appendChild(canvas)
    animationFrameId.value = window.requestAnimationFrame(render)
  })

  onBeforeUnmount(() => {
    if (animationFrameId.value) {
      window.cancelAnimationFrame(animationFrameId.value)
      animationFrameId.value = null
    }

    animationDirector?.stopAnimation()
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