<template>
  <div
    :data-hover="hoverObject !== null || undefined"
    :data-interactive="controlsMode === 'orbit' || undefined"
    class="PHome"
  >
    <div
      ref="wrapper"
      :style="{'--scrollHeight': `${scrollHeight}px`}"
      class="PHome__scrollWrapper"
    >
      <OInterActiveScene
        ref="scene"
        :active-object="activeObject"
        :frame-callback="onFrame"
        :hover-object="hoverObject"
        :interactive-element-names="[]"
        class="PHome__scene"
        model-url="/models/turntable/turntable.web.gltf"
        @click="onClick"
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
  import type { RotationAnimation } from '@/utils/useRotationAnimation'
  import { useRotationAnimation } from '@/utils/useRotationAnimation'
  import Lenis from '@studio-freight/lenis'
  import type { Object3D } from 'three'
  import { defineComponent, toRaw } from 'vue'

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

    setup () {
      const lenis = new Lenis({
        duration: 1.2,
        orientation: 'vertical', // vertical, horizontal
        gestureOrientation: 'vertical', // vertical, horizontal, both
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false
      })

      const config = {
        frameCount: 390,
        framesPerSecond: 30
      }

      return {
        lenis,
        vinylAnimation: {} as RotationAnimation,
        duration: config.frameCount / config.framesPerSecond,
        scrollHeight: config.frameCount * config.framesPerSecond,
        ...config
      }
    },

    data () {
      return {
        hoverObject: null as Object3D | null,
        activeObject: null as Object3D | null,
        controlsMode: 'scroll',
        currentFrame: 0,
        showHelp: false
      }
    },

    computed: {
      scene () {
        return this.$refs.scene as InstanceType<typeof OInterActiveScene>
      },

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

    watch: {
      activeObject (newActiveObject, previousActiveObject) {
        const rawNewActive = toRaw(newActiveObject)
        const rawPreviousActive = toRaw(previousActiveObject)

        console.info({
          rawNewActive,
          rawPreviousActive
        })
      }
    },

    mounted () {
      this.lenis.on('scroll', this.onScroll)
      this.vinylAnimation = useRotationAnimation(33, this.scene.getObjectByName('Vinyl') as Object3D, 'y')
    },

    beforeUnmount () {
      this.lenis.destroy()
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

      onScroll () {
        const scrollFactor = Math.min(MAX_ANIMATION_FACTOR, this.lenis.progress)

        const currentFrame = Math.round(scrollFactor * this.frameCount)
        if (currentFrame !== this.currentFrame) {
          this.currentFrame = currentFrame
        }

        this.scene.setAnimationTime(scrollFactor * this.duration)
      },

      onFrame (time: number, delta: number) {
        if (this.currentFrame > 300) {
          this.vinylAnimation.raf(delta)
        }

        !this.lenis.isStopped && this.lenis.raf(time)
      },

      async changeControlsMode (newMode: string) {
        if (this.controlsMode === newMode) {
          return
        }

        switch (newMode) {
          case 'scroll':
            this.disableInteractivity()
            await this.scene.stopOrbitControls()
            await this.scene.stopFPSControls()
            await this.scene.camera.userData.restoreInitialConfig()
            break
          case 'orbit':
            this.enableInteractivity()
            await this.scene.stopFPSControls()
            await this.scene.startOrbitControls()
            break
          case 'fps':
            this.enableInteractivity()
            await this.scene.stopOrbitControls()
            await this.scene.startFPSControls()
            break
        }

        this.controlsMode = newMode
      },

      enableInteractivity () {
        this.lenis.stop()
        // this.scene.startRaycasting()
        this.scene.setAnimationTime(MAX_ANIMATION_FACTOR * this.duration)
      },

      disableInteractivity () {
        this.lenis.start()
        // this.scene.stopRaycasting()
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