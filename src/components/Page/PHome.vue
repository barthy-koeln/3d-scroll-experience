<template>
  <div class="PHome">
  </div>
</template>

<script lang="ts">
  import nx from '@/assets/envmap/nx.png'
  import ny from '@/assets/envmap/ny.png'
  import nz from '@/assets/envmap/nz.png'

  import px from '@/assets/envmap/px.png'
  import py from '@/assets/envmap/py.png'
  import pz from '@/assets/envmap/pz.png'
  import { Easing, Tween, update as tweenUpdate } from '@tweenjs/tween.js'
  import {
    AmbientLight,
    Box3,
    Color,
    CubeTextureLoader,
    GridHelper,
    Material,
    Mesh,
    Object3D,
    PerspectiveCamera,
    Raycaster,
    Scene,
    Vector2,
    Vector3,
    WebGLRenderer
  } from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
  import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
  import type { PropType } from 'vue'
  import { defineComponent } from 'vue'

  const MIN_DISTANCE = 150
  const DURATION = 400

  export default defineComponent({
    name: 'PHome',

    props: {
      modelUrl: {
        type: String,
        required: true
      },

      elementsToInspect: {
        type: Array as PropType<string[]>,
        default () {
          return []
        }
      }
    },

    setup () {
      const canvas = document.createElement('canvas')

      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      const renderer = new WebGLRenderer(
        {
          canvas,
          alpha: true,
          antialias: true
        }
      )

      renderer.physicallyCorrectLights = true

      const cameraViewVector = new Vector3(1, 0, 1)

      const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight)
      camera.position.set(100, 125, 300)

      const orbitControls = new OrbitControls(camera, canvas)
      orbitControls.minDistance = MIN_DISTANCE
      orbitControls.update()

      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('/draco/')

      const gltfLoader = new GLTFLoader()
      gltfLoader.setDRACOLoader(dracoLoader)
      dracoLoader.preload()

      const envMapLoader = new CubeTextureLoader()
      const envMap = envMapLoader.load([px, nx, py, ny, pz, nz])

      const scene = new Scene()

      scene.environment = envMap

      const raycaster = new Raycaster()
      raycaster.firstHitOnly = true

      const pointer = new Vector2()

      const hoverColor = new Color(0xffdede)

      return {
        canvas,
        renderer,
        camera,
        cameraViewVector,
        orbitControls,
        scene,
        gltfLoader,
        envMap,
        raycaster,
        pointer,
        hoverColor,
        animationFrameId: null as number | null,
        interactiveObjects: [] as Object3D[],
        interactiveHover: null as Object3D | null,
        interactiveActive: null as Object3D | null,
        initialBox: null as Box3 | null
      }
    },

    mounted () {
      this.$el.parentNode.insertBefore(this.canvas, this.$el)

      const gridHelper = new GridHelper(250, 25)
      this.scene.add(gridHelper)

      this.scene.add(new AmbientLight(0xfcff99, 1))

      this.gltfLoader.load(
        this.modelUrl,
        (gltf) => {
          for (const objectName of this.elementsToInspect) {
            const object = gltf.scene.getObjectByName(objectName)

            if (!object) {
              continue
            }

            this.interactiveObjects.push(object)

            object.traverseVisible(this.prepareObjectForInteractivity)
            this.prepareObjectForInteractivity(object)
          }

          this.scene.add(gltf.scene)
          this.initialBox = new Box3().setFromObject(gltf.scene)
          this.frameObject(this.initialBox)

          this.start()
        },
        function (xhr) {
          console.info((xhr.loaded / xhr.total * 100) + '% loaded')
        },
        function (error) {
          console.error('An error happened', error)
        }
      )
    },

    beforeUnmount () {
      this.stop()
      this.canvas.remove()
    },

    expose: ['start', 'stop'],

    methods: {
      prepareObjectForInteractivity (object: Object3D) {
        if (object instanceof Mesh) {
          object.material = (object.material as Material).clone()
          object.material.initialColor = object.material.color.clone()
        }
      },

      checkAndAdaptDisplaySize () {
        const canvas = this.renderer.domElement
        const { clientWidth, clientHeight } = canvas
        const needResize = canvas.width !== clientWidth || canvas.height !== clientHeight

        if (needResize) {
          this.renderer.setSize(clientWidth, clientHeight, false)
        }

        this.camera.aspect = canvas.clientWidth / canvas.clientHeight
        this.camera.updateProjectionMatrix()
      },

      onPointerMove (event: MouseEvent) {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
      },

      /**
       * ! do not use reactivity here
       */
      render (time: DOMHighResTimeStamp) {
        this.checkAndAdaptDisplaySize()

        this.raycaster.setFromCamera(this.pointer, this.camera)
        this.renderer.render(this.scene, this.camera)

        this.updateIntersections()
        tweenUpdate(time)

        this.animationFrameId = window.requestAnimationFrame(this.render)
      },

      /**
       * ! do not use reactivity here
       */
      updateIntersections () {
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects)

        if (!intersects.length) {
          if (this.interactiveHover) {
            this.canvas.dispatchEvent(
              new CustomEvent(
                'update:hover',
                {
                  detail: null
                }
              )
            )
          }

          return
        }

        const firstIntersection = intersects[0]
        const interactiveParent = this.getClosestInteractiveParent(firstIntersection.object)

        if (interactiveParent !== this.interactiveHover) {
          this.canvas.dispatchEvent(
            new CustomEvent(
              'update:hover',
              {
                detail: interactiveParent
              }
            )
          )
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
            minDistance: 3 * MIN_DISTANCE
          })
          .onUpdate(() => this.orbitControls.update())
          .onComplete(() => {
            this.orbitControls.minDistance = MIN_DISTANCE
            this.orbitControls.update()
          })
          .start()

        this.camera.near = boxSize / 100
        this.camera.far = boxSize * 100
        this.camera.updateProjectionMatrix()

        this.orbitControls.maxDistance = boxSize * 10
        this.orbitControls.update()
      },

      onUpdateHover (event: CustomEvent<Object3D | null>) {
        this.interactiveHover = event.detail

        for (const object of this.interactiveObjects) {
          const isActive = this.interactiveHover === object

          object.traverseVisible(child => {
            if (child instanceof Mesh) {
              child.material.color = isActive ? this.hoverColor : child.material.initialColor
              child.material.needsUpdate = true
            }
          })
        }
      },

      onUpdateActive (event: CustomEvent<Object3D | null>) {
        const hadActive = this.interactiveActive !== null
        this.interactiveActive = event.detail

        const futurePosition = new Vector3(125, 0, 0)
        const defaultPosition = new Vector3(0, 0, 0)

        for (const object of this.interactiveObjects) {
          const isActive = this.interactiveActive === object

          new Tween(object.position)
            .duration(DURATION)
            .easing(Easing.Cubic.InOut)
            .to(isActive ? futurePosition : defaultPosition)
            .start()
        }

        if (this.interactiveActive) {
          this.frameObject(new Box3().setFromObject(this.interactiveActive), futurePosition)
          return
        }

        this.frameObject(this.initialBox)
      },

      onClick () {
        if (!this.interactiveHover) {
          return
        }

        this.canvas.dispatchEvent(
          new CustomEvent(
            'update:active',
            {
              detail: this.interactiveHover === this.interactiveActive ? null : this.interactiveHover
            }
          )
        )
      },

      start () {
        this.animationFrameId = window.requestAnimationFrame(this.render)
        window.addEventListener('pointermove', this.onPointerMove)
        this.canvas.addEventListener('click', this.onClick)
        this.canvas.addEventListener('update:hover', this.onUpdateHover)
        this.canvas.addEventListener('update:active', this.onUpdateActive)
      },

      stop () {
        if (!this.animationFrameId) {
          return
        }

        window.removeEventListener('pointermove', this.onPointerMove)
        this.canvas.removeEventListener('click', this.onClick)
        this.canvas.removeEventListener('update:hover', this.onUpdateHover)
        this.canvas.removeEventListener('update:active', this.onUpdateActive)
        window.cancelAnimationFrame(this.animationFrameId)
        this.animationFrameId = null
      }
    }
  })
</script>

<style lang="scss">
  .PHome {
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