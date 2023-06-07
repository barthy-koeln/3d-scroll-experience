<template>
  <div
    :data-hover="hoverObject !== null || undefined"
    :data-interactive="isInteractive || undefined"
    class="PHome"
  >
    <div
      ref="wrapper"
      :style="{'--scrollHeight': `${scrollHeight}px`}"
      class="PHome__scrollWrapper"
    >
      <OInterActiveScene
        ref="scene"
        class="PHome__scene"
        model-url="/models/keypad/keypad.bake.gltf"
        env-map-url="/envmap/brown_photostudio_02_1k.hdr"
      />
    </div>

    <OAppearList
      :current-frame="currentFrame"
      :items="staticRevealItems"
    />
  </div>
</template>

<script lang="ts" setup>
  import AScrollHint from '@/components/Atom/AScrollHint.vue'
  import MControlsChooser from '@/components/Molecule/MControlsChooser.vue'
  import MFeaturePreview from '@/components/Molecule/MFeaturePreview.vue'
  import MHeader from '@/components/Molecule/MHeader.vue'
  import OAppearList from '@/components/Organism/OAppearList.vue'
  import OInterActiveScene from '@/components/Organism/OInteractiveScene.vue'
  import { computed, inject, ref } from 'vue'
  import type { AnimationDirector } from '@/services/AnimationDirector'
  import { AnimationDirectorService } from '@/services/AnimationDirector'
  import { ControlsManager, ControlsManagerService } from '@/services/ControlsManager'

  const animationDirector = inject<AnimationDirector>(AnimationDirectorService) as AnimationDirector
  const controlsManager = inject<ControlsManager>(ControlsManagerService) as ControlsManager

  animationDirector.setConfig({
    frameCount: 190,
    framesPerSecond: 30
  })

  controlsManager.setAvailableControls([
    'scroll',
    'orbit'
  ])

  const hoverObject = ref(null)
  const currentFrame = animationDirector.currentFrame
  const controlsType = controlsManager.currentControlsType

  const scrollHeight = computed(() => animationDirector.config?.frameCount * animationDirector.config?.framesPerSecond)
  const isInteractive = computed(() => controlsType.value !== 'scroll')

  const staticRevealItems = computed(() => [
    {
      key: 'header',
      component: MHeader,
      startFrame: 0,
      endFrame: 5,
      props: {
        title: 'Buttons on a Board!',
        subTitle: 'Batteries Included.'
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
      startFrame: 25,
      endFrame: 45,
      props: {
        title: 'Special Buttons',
        paragraph: 'Non-configurable because we know\nwhat\'s good for you.'
      },
      style: {
        right: '4%',
        top: '4%'
      }
    },
    {
      key: 'step-2',
      component: MFeaturePreview,
      startFrame: 60,
      endFrame: 80,
      props: {
        title: 'Ergonomic Design',
        paragraph: 'Was a consideration but not a requirement.'
      },
      style: {
        right: '4%',
        bottom: '4%'
      }
    },
    {
      key: 'step-3',
      component: MFeaturePreview,
      startFrame: 105,
      endFrame: 125,
      props: {
        title: 'Battery Indicator',
        paragraph: 'But on the back, so that you can\'t\nsee it without lifting the keyboard.'
      },
      style: {
        right: '4%',
        top: '4%'
      }
    },
    {
      key: 'step-4',
      component: MFeaturePreview,
      startFrame: 145,
      endFrame: 165,
      props: {
        title: 'USB Dongle',
        paragraph: 'Universal Serial Bus should work everywhere. Right? Right!??'
      },
      style: {
        left: '4%',
        bottom: '4%'
      }
    },
    {
      key: 'controls-chooser',
      component: MControlsChooser,
      startFrame: 190,
      endFrame: Infinity,
      class: 'PHome__controlsChooser'
    }
  ])
</script>

<style lang="scss">
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
