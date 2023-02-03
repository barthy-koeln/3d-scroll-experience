<template>
  <div
    class="OInterActiveScene"
    @pointerdown.passive="onPointerDown"
    @pointerup.passive="onPointerUp"
  >
  </div>
</template>

<script lang="ts">
  import { useBVHRaycaster } from '@/utils/useBVHRaycaster'
  import { useClickWithoutDragging } from '@/utils/useClickWithoutDragging'
  import { useDefaultScene } from '@/utils/useDefaultScene'
  import { useEnvMap } from '@/utils/useEnvMap'
  import { useFirstPersonControls } from '@/utils/useFirstPersonControls'
  import { useInteractiveGLTF } from '@/utils/useInteractiveGLTF'
  import { useOrbitControls } from '@/utils/useOrbitControls'
  import { useResizeListeners } from '@/utils/useResizeListeners'
  import { useResponsiveCamera } from '@/utils/useResponsiveCamera'
  import { useResponsiveCanvas } from '@/utils/useResponsiveCanvas'
  import { useResponsiveRenderer } from '@/utils/useResponsiveRenderer'
  import { useRestorableCamera } from '@/utils/useRestorableCamera'
  import { useTrackedPointer } from '@/utils/useTrackedPointer'
  import { update as updateAllTweens } from '@tweenjs/tween.js'
  import { Clock, Color, Object3D } from 'three'
  import type { PropType, SetupContext } from 'vue'
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'OInterActiveScene',

    props: {
      modelUrl: {
        type: String,
        required: true
      },

      interactiveElementNames: {
        type: Array as PropType<string[]>,
        default: () => []
      },

      hoverObject: {
        type: Object as PropType<Object3D | null>,
        default: () => null
      },

      activeObject: {
        type: Object as PropType<Object3D | null>,
        default: () => null
      },

      hoverColor: {
        type: Object as PropType<Color>,
        default: () => new Color(0xffdede)
      },

      frameCallback: {
        type: Function as PropType<undefined | ((time: number, delta: number) => void)>,
        default: () => null
      }
    },

    data () {
      return {
        pointerDownLocation: null as [number, number] | null,
        animationFrameId: null as number | null
      }
    },

    async setup (props, context: SetupContext) {
      const { canvas, updateCanvas } = useResponsiveCanvas()
      const { renderer, updateRenderer } = useResponsiveRenderer(canvas)

      const envMap = await useEnvMap(renderer)
      const scene = useDefaultScene(envMap)
      const anisotropy = renderer.capabilities.getMaxAnisotropy()
      const interactiveGltf = await useInteractiveGLTF(props.modelUrl, props.interactiveElementNames, scene, anisotropy)

      const { camera: responsiveCamera, updateCamera } = useResponsiveCamera(interactiveGltf.camera)
      const camera = useRestorableCamera(responsiveCamera, interactiveGltf.cameraTarget)

      return {
        ...interactiveGltf,
        ...useBVHRaycaster(context),
        ...useTrackedPointer(),
        ...useOrbitControls(camera, interactiveGltf.cameraTarget, canvas),
        ...useFirstPersonControls(camera, interactiveGltf.cameraTarget, canvas),
        ...useClickWithoutDragging(context),
        ...useResizeListeners([
          updateCanvas,
          updateCamera,
          updateRenderer
        ]),

        renderer,
        canvas,
        camera,
        scene,
        getObjectByName: scene.getObjectByName.bind(scene),
        clock: new Clock()
      }
    },

    async mounted () {
      this.start()
    },

    beforeUnmount () {
      this.stop()
    },

    emits: [
      'update:hover',
      'click',
      'frame'
    ],

    watch: {
      hoverObject (newHoverObject) {
        if (newHoverObject) {
          // hover

          return
        }

        // no hover
      }
    },

    methods: {

      /**
       * ! do not use reactivity here
       */
      render (time: number) {
        const delta = this.clock.getDelta()
        this.raycaster.setFromCamera(this.pointer, this.camera)

        this.orbitControls?.enabled && this.orbitControls.update()
        this.firstPersonControls?.enabled && this.firstPersonControls.update(delta)

        this.updateIntersections(this.interactiveObjects, this.hoverObject)
        updateAllTweens(time)

        this.frameCallback?.(time, delta)

        this.renderer.render(this.scene, this.camera)

        this.animationFrameId = window.requestAnimationFrame(this.render)
      },

      start () {
        this.startTrackingPointer()
        this.startResizeListener()
        this.$el.appendChild(this.canvas)

        this.animationFrameId = window.requestAnimationFrame(this.render)
      },

      stop () {
        if (this.animationFrameId) {
          window.cancelAnimationFrame(this.animationFrameId)
          this.animationFrameId = null
        }

        this.clipsMixer.timeScale = 0
        this.stopTrackingPointer()
        this.stopResizeListener()
        this.canvas.remove()
      }
    }
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
  }

  canvas {
    height: auto;
    inset: 0 0 0 0;
    position: absolute;
    width: 100%;
  }
</style>