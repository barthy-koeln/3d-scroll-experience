<template>
  <div
    :data-hover="hoverObject !== null || undefined"
    class="PHome"
  >
    <Transition
      mode="out-in"
      name="fade"
    >
      <Suspense>
        <template #default>
          <div
            :style="{'--scrollHeight': `${scrollHeight}px`}"
            class="PHome__scrollWrapper"
          >
            <OInterActiveScene
              ref="scene"
              :active-object="activeObject"
              :frame-callback="onFrame"
              :hover-object="hoverObject"
              :interactive-element-names="[
                  'top_floor',
                  'bottom_floor',
                  'roof'
                ]"
              class="PHome__scene"
              model-url="/models/monica_lubenau/monica_lubenau.gltf"
              @click="onClick"
              @start-orbit-controls="onOrbitControlsStart"
              @stop-orbit-controls="onOrbitControlsStop"
              @update:hover="onUpdateHover"
            />
          </div>
        </template>

        <template #fallback>
          <div class="PHome__loading">
            <ALoadingIndicator/>
          </div>
        </template>
      </Suspense>
    </Transition>

    <div>
      <Transition
        mode="out-in"
        name="fade"
      >
        <template v-if="hoverMeta">
          <MHoverDescription
            :description="hoverMeta.description"
            :title="hoverMeta.title"
          />
        </template>
      </Transition>

      <button
        class="PHome__helpButton"
        type="button"
        @click="showHelp = !showHelp"
      >
        <strong>&quest;</strong>

        <QVisuallyHidden>Help</QVisuallyHidden>
      </button>

      <Transition
        mode="out-in"
        name="fade"
      >
        <template v-if="showHelp">
          <MHoverDescription
            description="Left mouse button to rotate, right mouse button to pan. Middle mouse button and wheel to zoom."
            title="Camera Controls"
          />
        </template>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts">
  import ALoadingIndicator from '@/components/Atom/ALoadingIndicator.vue'
  import MHoverDescription from '@/components/Molecule/MHoverDescription.vue'
  import OInterActiveScene from '@/components/Organism/OInteractiveScene.vue'
  import QVisuallyHidden from '@/components/Quark/QVisuallyHidden.vue'
  import { MAX_ANIMATION_FACTOR } from '@/utils/constants'
  import { useObjectDetailView } from '@/utils/useObjectDetailView'
  import Lenis from '@studio-freight/lenis'
  import type { Object3D } from 'three'
  import { defineComponent, ref, toRaw } from 'vue'

  export default defineComponent({
    name: 'PHome',

    components: {
      QVisuallyHidden,
      MHoverDescription,
      ALoadingIndicator,
      OInterActiveScene
    },

    data () {
      return {
        hoverObject: null as Object3D | null,
        activeObject: null as Object3D | null,
        orbitEnabled: false,
        showHelp: false
      }
    },

    computed: {
      hoverMeta () {
        if (!this.hoverObject) {
          return null
        }

        return {
          'top_floor': {
            title: 'Top Floor',
            description: 'Three bedrooms, two baths and a luxurious balcony.'
          },

          'roof': {
            title: 'Roof',
            description: 'It will probably fall to pieces as soon as it snows, since nothing can fall off the side. Good thing this looks like a Californian Villa.'
          },

          'bottom_floor': {
            title: 'Bottom Floor',
            description: 'Large open living room and kitchen, household utility rooms and a guest bedroom.'
          }
        }[this.hoverObject.name]
      }
    },

    setup () {
      const scene = ref<InstanceType<typeof OInterActiveScene> | null>(null)

      const lenis = new Lenis({
        duration: 1.2,
        // easing: Math.sin,
        direction: 'vertical', // vertical, horizontal
        gestureDirection: 'vertical', // vertical, horizontal, both
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false
      })

      const config = {
        frameCount: 300,
        framesPerSecond: 30
      }

      return {
        scene,
        lenis,
        duration: config.frameCount / config.framesPerSecond,
        scrollHeight: config.frameCount * config.framesPerSecond,
        ...useObjectDetailView(scene)
      }
    },

    watch: {
      activeObject (newActiveObject, previousActiveObject) {
        if (!this.scene) {
          return
        }

        const rawNewActive = toRaw(newActiveObject)
        const rawPreviousActive = toRaw(previousActiveObject)

        this.toggleActiveObject(this.scene.interactiveObjects, rawNewActive, rawPreviousActive)
        this.scene.setAnimationTime(1)
      }
    },

    methods: {
      onClick () {
        if (!this.hoverObject) {
          return
        }

        if (this.hoverObject === this.activeObject) {
          this.activeObject = null
          return
        }

        this.activeObject = this.hoverObject
      },

      onUpdateHover (object: Object3D | null) {
        this.hoverObject = object
      },

      onOrbitControlsStart () {
        this.orbitEnabled = true
        this.lenis.start()
      },

      onOrbitControlsStop () {
        this.orbitEnabled = false
        this.lenis.start()
      },

      onFrame (time: number) {
        if (!this.scene) {
          return
        }

        if (this.lenis.stopped) {
          return
        }

        this.lenis.raf(time)
        const maxScrollDistance = this.scrollHeight - window.innerHeight
        const scrollFactor = Math.min(MAX_ANIMATION_FACTOR, window.scrollY / maxScrollDistance) // factor 1 is start of next loop

        if (scrollFactor >= MAX_ANIMATION_FACTOR) {
          if (!this.orbitEnabled) {
            this.lenis.stop()
            this.scene.startOrbitControls()
            this.scene.setAnimationTime(MAX_ANIMATION_FACTOR * this.duration)
          }

          return
        }

        if (this.orbitEnabled) {
          this.lenis.stop()
          this.scene.stopOrbitControls()
          return
        }

        this.scene.setAnimationTime(scrollFactor * this.duration)
      }
    }
  })
</script>

<style lang="scss">
  @use "@/variables" as *;

  .PHome {
    width: 100%;

    &[data-hover] {
      cursor: pointer;
    }

    &__loading {
      background-color: #181818;
      position: fixed;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }

    &__scrollWrapper {
      position: relative;
      height: var(--scrollHeight);
    }

    &__scene {
      position: sticky;
      top: 0;
    }

    &__helpButton {
      position: fixed;
      top: spacer();
      left: spacer();
    }
  }
</style>