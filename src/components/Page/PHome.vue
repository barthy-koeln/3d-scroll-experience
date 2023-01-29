<template>
  <div
    :data-hover="hoverObject !== null || undefined"
    :data-interactive="interactivityEnabled || undefined"
    :style="pointerStyles"
    class="PHome"
  >
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
        model-url="/models/turntable/turntable.web.gltf"
        @click="onClick"
        @start-orbit-controls="onOrbitControlsStart"
        @stop-orbit-controls="onOrbitControlsStop"
        @pointermove.passive="onPointerMove"
        @update:hover="onUpdateHover"
      />
    </div>

    <OAppearList
      :current-frame="currentFrame"
      :items="scrollRevealItems"
    />
  </div>
</template>

<script lang="ts">
  import AButton from '@/components/Atom/AButton.vue'
  import AScrollHint from '@/components/Atom/AScrollHint.vue'
  import MFeaturePreview from '@/components/Molecule/MFeaturePreview.vue'
  import MHeader from '@/components/Molecule/MHeader.vue'
  import type { ScrollRevealItem } from '@/components/Organism/OAppearList.vue'
  import OAppearList from '@/components/Organism/OAppearList.vue'
  import OInterActiveScene from '@/components/Organism/OInteractiveScene.vue'
  import { MAX_ANIMATION_FACTOR } from '@/utils/constants'
  import { useObjectDetailView } from '@/utils/useObjectDetailView'
  import Lenis from '@studio-freight/lenis'
  import type { Object3D } from 'three'
  import { defineComponent, ref, toRaw } from 'vue'

  const staticRevealItems = [
    {
      key: 'header',
      component: MHeader,
      startFrame: 0,
      endFrame: 5,
      props: {
        title: 'Hold My Sleeve!',
        subTitle: 'Beautiful and space-saving cover holder'
      }
    },
    {
      key: 'scroll-hint',
      component: AScrollHint,
      startFrame: 0,
      endFrame: 5,
      props: {}
    },
    {
      key: 'step-1',
      component: MFeaturePreview,
      startFrame: 5,
      endFrame: 55,
      props: {
        index: 0,
        title: 'Remove The Dust Cover',
        paragraph: 'It looks old and crappy anyway.'
      }
    },
    {
      key: 'step-2',
      component: MFeaturePreview,
      startFrame: 75,
      endFrame: 125,
      props: {
        index: 1,
        title: 'Clip The Clippy Things',
        paragraph: 'They will fit right into the dust cover\'s joints.'
      }
    },
    {
      key: 'step-3',
      component: MFeaturePreview,
      startFrame: 125,
      endFrame: 175,
      props: {
        index: 2,
        title: 'Get Your Wax Out',
        paragraph: 'Don\'t forget to wipe.'
      }
    },
    {
      key: 'step-4',
      component: MFeaturePreview,
      startFrame: 205,
      endFrame: 255,
      props: {
        index: 3,
        title: 'Store the sleeve',
        paragraph: 'This will fit sleeves with up to two 220g vinyls.'
      }
    },
    {
      key: 'step-5',
      component: MFeaturePreview,
      startFrame: 300,
      endFrame: 350,
      props: {
        index: 4,
        title: 'Lean Back & Enjoy The Music',
        paragraph: 'And take some time to appreciate that beautiful cover.'
      }
    }
  ]

  export default defineComponent({
    name: 'PHome',

    components: {
      OAppearList,
      OInterActiveScene
    },

    data () {
      return {
        hoverObject: null as Object3D | null,
        activeObject: null as Object3D | null,
        interactivityEnabled: false,
        currentFrame: 0,
        showHelp: false,
        pointerStyles: {}
      }
    },

    computed: {
      scrollRevealItems (): ScrollRevealItem[] {
        return [
          ...staticRevealItems,
          {
            key: 'interactivity-button',
            component: AButton,
            startFrame: 350,
            endFrame: 999,
            class: 'PHome__interactivityButton',
            props: {
              label: this.interactivityEnabled ? 'Enable Scrolling Mode' : 'Enable Interactivity Mode'
            },

            on: {
              click: this.onToggleInteractivity
            }
          }
        ]
      }
    },

    setup () {
      const scene = ref<InstanceType<typeof OInterActiveScene> | null>(null)

      const lenis = new Lenis({
        duration: 1.2,
        direction: 'vertical', // vertical, horizontal
        gestureDirection: 'vertical', // vertical, horizontal, both
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false
      })

      const config = {
        frameCount: 390,
        framesPerSecond: 30
      }

      return {
        scene,
        lenis,
        duration: config.frameCount / config.framesPerSecond,
        scrollHeight: config.frameCount * config.framesPerSecond,
        ...config,
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
        this.interactivityEnabled = true
        this.lenis.start()
      },

      onOrbitControlsStop () {
        this.interactivityEnabled = false
        this.lenis.start()
      },

      onFrame (time: number) {
        if (!this.scene) {
          return
        }

        if (this.lenis.stopped || this.interactivityEnabled) {
          return
        }

        this.lenis.raf(time)
        const maxScrollDistance = this.scrollHeight - window.innerHeight // TODO make responsive
        const scrollFactor = Math.min(MAX_ANIMATION_FACTOR, window.scrollY / maxScrollDistance)

        const currentFrame = Math.round(scrollFactor * this.frameCount)
        if (currentFrame !== this.currentFrame) {
          this.currentFrame = currentFrame
        }

        this.scene.setAnimationTime(scrollFactor * this.duration)
      },

      onToggleInteractivity () {
        this.interactivityEnabled ? this.disableInteractivity() : this.enableInteractivity()
      },

      enableInteractivity () {
        if (!this.scene) {
          return
        }

        this.lenis.stop()
        this.scene.startOrbitControls()
        this.scene.startRaycasting()
        this.scene.setAnimationTime(MAX_ANIMATION_FACTOR * this.duration)
      },

      disableInteractivity () {
        if (!this.scene) {
          return
        }

        this.lenis.stop()
        this.scene.stopOrbitControls()
        this.scene.stopRaycasting()
      },

      onPointerMove (event: PointerEvent) {
        this.pointerStyles = {
          '--pointer-x': event.clientX + 5 + 'px',
          '--pointer-y': event.clientY + 5 + 'px'
        }
      }
    }
  })
</script>

<style lang="scss">
  @use "@/variables" as *;

  .PHome {
    width: 100%;

    &[data-interactive] {
      cursor: move;
    }

    &[data-hover] {
      cursor: pointer;
    }

    &__scrollWrapper {
      height: var(--scrollHeight);
      position: relative;
    }

    &__scene {
      position: sticky;
      top: 0;
    }

    &__interactivityButton {
      bottom: spacer(5);
      left: 50%;
      position: absolute;
      transform: translateX(-50%);
    }
  }
</style>