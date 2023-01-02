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
  import { useCamera } from '@/utils/useCamera'
  import { useCanvas } from '@/utils/useCanvas'
  import { useClickWithoutDragging } from '@/utils/useClickWithoutDragging'
  import { useComposer } from '@/utils/useComposer'
  import { useDefaultScene } from '@/utils/useDefaultScene'
  import { useInteractiveGLTF } from '@/utils/useInteractiveGLTF'
  import { useOrbitControls } from '@/utils/useOrbitControls'
  import { useRenderer } from '@/utils/useRenderer'
  import { useResponsiveHandlers } from '@/utils/useResponsiveHandlers'
  import { useTrackedPointer } from '@/utils/useTrackedPointer'
  import { update as updateAllTweens } from '@tweenjs/tween.js'
  import { Color, Object3D } from 'three'
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
        default () {
          return []
        }
      },

      hoverObject: {
        type: Object as PropType<Object3D | null>,
        default () {
          return null
        }
      },

      activeObject: {
        type: Object as PropType<Object3D | null>,
        default () {
          return null
        }
      },

      hoverColor: {
        type: Object as PropType<Color>,
        default: () => new Color(0xffdede)
      }
    },

    data () {
      return {
        pointerDownLocation: null as [number, number] | null,
        animationFrameId: null as number | null
      }
    },

    async setup (props, context: SetupContext) {
      const canvas = useCanvas()
      const renderer = useRenderer(canvas)
      const camera = useCamera(100, 125, 300)
      const scene = useDefaultScene()

      const {
        composer,
        outlinePass,
        effectFXAA
      } = useComposer(renderer, scene, camera)

      return {
        canvas,
        composer,
        outlinePass,
        camera,
        scene,
        ...useBVHRaycaster(context),
        ...useTrackedPointer(),
        ...useOrbitControls(camera, canvas),
        ...useClickWithoutDragging(context),
        ...useResponsiveHandlers(canvas, composer, renderer, effectFXAA, camera),
        ...await useInteractiveGLTF(props.modelUrl, props.interactiveElementNames, scene)
      }
    },

    async mounted () {
      this.frameObject(this.initialBox)
      this.start()
    },

    beforeUnmount () {
      this.stop()
    },

    expose: [
      'start',
      'stop',
      'startOrbitControls',
      'stopOrbitControls',
      'interactiveObjects',
      'frameObject',
      'resetFrame'
    ],

    emits: [
      'update:hover',
      'click'
    ],

    watch: {
      hoverObject (newHoverObject) {
        if (newHoverObject) {
          this.outlinePass.selectedObjects = [newHoverObject]
          return
        }

        this.outlinePass.selectedObjects = []
      }
    },

    methods: {

      /**
       * ! do not use reactivity here
       */
      render (time: number) {
        this.raycaster.setFromCamera(this.pointer, this.camera)
        this.orbitControls.update()
        this.composer.render()
        this.updateIntersections(this.interactiveObjects, this.hoverObject)
        updateAllTweens(time)

        this.animationFrameId = window.requestAnimationFrame(this.render)
      },

      resetFrame () {
        this.frameObject(this.initialBox)
      },

      start () {
        this.startTrackingPointer()
        this.startResponsivenessHandlers()
        this.$el.appendChild(this.canvas)

        this.animationFrameId = window.requestAnimationFrame(this.render)
      },

      stop () {
        if (this.animationFrameId) {
          window.cancelAnimationFrame(this.animationFrameId)
          this.animationFrameId = null
        }

        this.stopTrackingPointer()
        this.stopResponsivenessHandlers()
        this.canvas.remove()
      }
    }
  })
</script>

<style lang="scss">
  .OInterActiveScene {
    background-color: #a3a3a3;
    height: 100vh;
    inset: 0 0 0 0;
    position: fixed;
    width: 100vw;
    z-index: -1;
  }

  canvas {
    inset: 0 0 0 0;
    position: fixed;
    z-index: 1;
  }
</style>