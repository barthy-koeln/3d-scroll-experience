<template>
  <div class="OInterActiveScene">
  </div>
</template>

<script lang="ts">
  import { ORBIT_MIN_DISTANCE } from '@/utils/constants'
  import { useBVHRaycaster } from '@/utils/useBVHRaycaster'
  import { useCamera } from '@/utils/useCamera'
  import { useCanvas } from '@/utils/useCanvas'
  import { useComposer } from '@/utils/useComposer'
  import { useDefaultScene } from '@/utils/useDefaultScene'
  import { useEnvMap } from '@/utils/useEnvMap'
  import { useInteractiveGLTF } from '@/utils/useInteractiveGLTF'
  import { useOrbitControls } from '@/utils/useOrbitControls'
  import { useRenderer } from '@/utils/useRenderer'
  import { useResponsiveHandlers } from '@/utils/useResponsiveHandlers'
  import { useTrackedPointer } from '@/utils/useTrackedPointer'
  import { Easing, Tween, update as updateAllTweens } from '@tweenjs/tween.js'
  import { Box3, Color, Object3D, Vector3 } from 'three'
  import type { PropType } from 'vue'
  import { defineComponent, toRaw } from 'vue'

  const DURATION = 400

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
      }
    },

    async setup (props) {
      const {
        canvas,
        insertCanvas,
        removeCanvas
      } = useCanvas()

      const renderer = useRenderer(canvas)
      const camera = useCamera(100, 125, 300)
      const orbitControls = useOrbitControls(camera, canvas)

      const envMap = useEnvMap()
      const raycaster = useBVHRaycaster()

      const {
        gltf,
        initialBox,
        interactiveObjects
      } = await useInteractiveGLTF(props.modelUrl, props.interactiveElementNames)

      const {
        pointer,
        startTrackingPointer,
        stopTrackingPointer
      } = useTrackedPointer()

      const scene = useDefaultScene(envMap, [gltf.scene])
      const {
        composer,
        outlinePass,
        effectFXAA
      } = useComposer(renderer, scene, camera)

      const {
        startResponsivenessHandlers,
        stopResponsivenessHandlers
      } = useResponsiveHandlers(canvas, composer, renderer, effectFXAA, camera)

      const hoverColor = new Color(0xffdede)
      const activePosition = new Vector3(125, 0, 0)
      const defaultPosition = new Vector3(0, 0, 0)

      return {
        canvas,
        insertCanvas,
        removeCanvas,
        composer,
        outlinePass,
        camera,
        orbitControls,
        scene,
        envMap,
        raycaster,
        pointer,
        startTrackingPointer,
        stopTrackingPointer,
        hoverColor,
        interactiveObjects,
        initialBox,
        startResponsivenessHandlers,
        stopResponsivenessHandlers,
        activePosition,
        defaultPosition,
        animationFrameId: null as number | null
      }
    },

    async mounted () {
      this.frameObject(this.initialBox)
      this.start()
    },

    beforeUnmount () {
      this.stop()
    },

    expose: ['start', 'stop'],
    emits: ['update:hover'],

    watch: {
      hoverObject (newHoverObject) {
        if (newHoverObject) {
          this.outlinePass.selectedObjects = [newHoverObject]
          return
        }

        this.outlinePass.selectedObjects = []
      },

      activeObject (newActiveObject) {
        const rawNewActive = toRaw(newActiveObject)
        for (const object of this.interactiveObjects) {
          const isActive = rawNewActive === object

          new Tween(object.position)
            .duration(DURATION)
            .easing(Easing.Cubic.InOut)
            .to(isActive ? this.activePosition : this.defaultPosition)
            .start()
        }

        if (newActiveObject) {
          this.frameObject(new Box3().setFromObject(newActiveObject), this.activePosition)
          return
        }

        this.frameObject(this.initialBox)
      }
    },

    methods: {

      /**
       * ! do not use reactivity here
       */
      render (time: number) {
        this.raycaster.setFromCamera(this.pointer, this.camera)
        this.composer.render()

        this.updateIntersections()
        updateAllTweens(time)

        this.animationFrameId = window.requestAnimationFrame(this.render)
      },

      /**
       * ! do not use reactivity here
       */
      updateIntersections () {
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects)

        if (!intersects.length) {
          if (this.hoverObject) {
            this.$emit('update:hover', null)
          }

          return
        }

        const firstIntersection = intersects[0]
        const interactiveParent = this.getClosestInteractiveParent(firstIntersection.object)

        if (interactiveParent !== this.hoverObject) {
          this.$emit('update:hover', interactiveParent)
        }
      },

      getClosestInteractiveParent (object: Object3D | null) {
        while (object) {
          if (this.interactiveObjects.includes(object)) {
            return object
          }

          if (object.parent) {
            object = object.parent
            continue
          }

          object = null
        }

        return object
      },

      frameObject (box: Box3 | null, offset: Vector3 | undefined = undefined) {
        if (!box) {
          box = new Box3().setFromObject(this.scene)
        }

        const boxSize = box.getSize(new Vector3()).length()
        const boxCenter = box.getCenter(new Vector3())

        if (offset) {
          boxCenter.add(offset)
        }

        new Tween(this.orbitControls)
          .duration(DURATION)
          .easing(Easing.Cubic.InOut)
          .to({
            target: boxCenter,
            minDistance: ORBIT_MIN_DISTANCE
          })
          .onUpdate(() => this.orbitControls.update())
          .onComplete(() => {
            this.orbitControls.minDistance = ORBIT_MIN_DISTANCE
            this.orbitControls.update()
          })
          .start()

        this.camera.near = boxSize / 100
        this.camera.far = boxSize * 100
        this.camera.updateProjectionMatrix()

        this.orbitControls.maxDistance = boxSize * 10
        this.orbitControls.update()
      },

      start () {
        this.startTrackingPointer()
        this.startResponsivenessHandlers()
        this.insertCanvas(this.$el)

        this.animationFrameId = window.requestAnimationFrame(this.render)
      },

      stop () {
        if (this.animationFrameId) {
          window.cancelAnimationFrame(this.animationFrameId)
          this.animationFrameId = null
        }

        this.stopTrackingPointer()
        this.stopResponsivenessHandlers()
        this.removeCanvas()
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