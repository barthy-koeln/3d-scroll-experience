<template>
  <div
    :data-hover="hoverObject !== null || undefined"
    :data-interactive="controlsMode === 'orbit' || undefined"
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
  import AScrollHint from '@/components/Atom/AScrollHint.vue'
  import MControlsChooser from '@/components/Molecule/MControlsChooser.vue'
  import MFeaturePreview from '@/components/Molecule/MFeaturePreview.vue'
  import MHeader from '@/components/Molecule/MHeader.vue'
  import type { ScrollRevealItem } from '@/components/Organism/OAppearList.vue'
  import OAppearList from '@/components/Organism/OAppearList.vue'
  import OInterActiveScene from '@/components/Organism/OInteractiveScene.vue'
  import { MAX_ANIMATION_FACTOR } from '@/utils/constants'
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
      },
      style: {
        '--border-radius': '22% 78% 54% 46% / 55% 55% 45% 45% ',
        left: '4%',
        bottom: '4%'
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
      },
      style: {
        '--border-radius': '30% 70% 70% 30% / 30% 30% 70% 70% ',
        top: '4%',
        left: '4%'
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
        paragraph: 'Don\'t forget to wipe. And maybe wash your hands.'
      },
      style: {
        '--border-radius': '22% 78% 54% 46% / 55% 55% 45% 45%',
        right: '4%',
        top: '8%'
      }
    },
    {
      key: 'step-4',
      component: MFeaturePreview,
      startFrame: 205,
      endFrame: 255,
      props: {
        index: 3,
        title: 'Slip the sleeve into the clips',
        paragraph: 'This will fit sleeves with up to two 220g vinyls.'
      },
      style: {
        '--border-radius': '26% 74% 70% 30% / 74% 79% 21% 26%',
        bottom: '8%',
        right: '4%'
      }
    },
    {
      key: 'step-5',
      component: MFeaturePreview,
      startFrame: 320,
      endFrame: 370,
      props: {
        index: 4,
        title: 'Lean Back & Enjoy The Music',
        paragraph: 'And take some time to appreciate that beautiful cover.'
      },
      style: {
        '--border-radius': '24% 76% 63% 37% / 81% 55% 45% 19%',
        bottom: '4%',
        left: '4%'
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
        controlsMode: 'scroll',
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
            key: 'controls-chooser',
            component: MControlsChooser,
            startFrame: 380,
            endFrame: 999,
            class: 'PHome__controlsChooser',
            props: {
              mode: this.controlsMode
            },

            on: {
              'update:mode': this.changeControlsMode
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
        ...config
      }
    },

    watch: {
      activeObject (newActiveObject, previousActiveObject) {
        if (!this.scene) {
          return
        }

        const rawNewActive = toRaw(newActiveObject)
        const rawPreviousActive = toRaw(previousActiveObject)

        console.info({
          rawNewActive,
          rawPreviousActive
        })
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

      onFrame (time: number) {
        if (!this.scene) {
          return
        }

        if (this.lenis.stopped) {
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

      async changeControlsMode (newMode: string) {
        if (this.controlsMode === newMode) {
          return
        }


        switch (newMode) {
          case 'scroll':
            this.disableInteractivity()
            await this.scene?.stopOrbitControls()
            await this.scene?.stopFPSControls()
            await this.scene?.camera.userData.restoreInitialConfig()
            break
          case 'orbit':
            this.enableInteractivity()
            await this.scene?.stopFPSControls()
            await this.scene?.startOrbitControls()
            break
          case 'fps':
            this.enableInteractivity()
            await this.scene?.stopOrbitControls()
            await this.scene?.startFPSControls()
            break
        }

        this.controlsMode = newMode
      },

      enableInteractivity () {
        this.lenis.stop()
        // this.scene.startRaycasting()
        this.scene?.setAnimationTime(MAX_ANIMATION_FACTOR * this.duration)
      },

      disableInteractivity () {
        this.lenis.start()
        // this.scene.stopRaycasting()
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

    &__controlsChooser {
      bottom: var(--spacer);
      left: 50%;
      position: absolute;
      transform: translateX(-50%);
    }
  }
</style>