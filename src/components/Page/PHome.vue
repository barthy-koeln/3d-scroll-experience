<template>
  <div
    :data-hover="interactiveObjectsStore.hoverObject !== null || undefined"
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
        :interactive-element-names="[
          'key-0',
          'key-1',
          'key-2',
          'key-3',
          'key-4',
          'key-5',
          'key-6',
          'key-7',
          'key-8',
          'key-9',
          'key-asterisk',
          'key-backward',
          'key-calculator',
          'key-colon',
          'key-enter',
          'key-forward',
          'key-home',
          'key-mail',
          'key-minus',
          'key-num',
          'key-play-pause',
          'key-plus',
          'key-screen',
          'key-search',
          'key-slash',
          'key-stop',
        ]"
        @pointerdown.passive="onPointerDown"
        @pointerup.passive="onPointerUp"
      />
    </div>

    <OAppearList
      :current-frame="animationsStore.currentFrame"
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
  import { computed } from 'vue'
  import { useControlsStore } from '@/state/useControlsStore'
  import { useAnimationsStore } from '@/state/useAnimationsStore'
  import { useInteractiveObjectsStore } from '@/state/useInteractiveObjectsStore'
  import { useClickWithoutDragging } from '@/composables/useClickWithoutDragging'
  import { Easing, Tween } from '@tweenjs/tween.js'
  import { DURATION_SNAPPY } from '@/constants'

  const controlsStore = useControlsStore()
  const animationsStore = useAnimationsStore()
  const interactiveObjectsStore = useInteractiveObjectsStore()
  const tweens = new Map<string, Tween<Record<string, any>>>()

  animationsStore.setConfig({
    frameCount: 190,
    framesPerSecond: 30
  })

  controlsStore.setAvailableControls([
    'scroll',
    'orbit'
  ])

  const { onPointerUp, onPointerDown } = useClickWithoutDragging(() => {
    if (!interactiveObjectsStore.hoverObject) {
      return
    }

    const name = interactiveObjectsStore.hoverObject.name
    if (tweens.has(name)) {
      return
    }

    tweens.set(name, new Tween(interactiveObjectsStore.hoverObject.position)
      .easing(Easing.Cubic.InOut)
      .repeat(1)
      .yoyo(true)
      .to(
        {
          y: interactiveObjectsStore.hoverObject.position.y - 0.005
        },
        DURATION_SNAPPY
      )
      .onComplete(() => {
        tweens.delete(name)
      })
      .start()
    )
  })

  const scrollHeight = computed(() => {
    if (!animationsStore.config) {
      return 0
    }

    return animationsStore.config.frameCount * animationsStore.config.framesPerSecond
  })
  const isInteractive = computed(() => controlsStore.currentControlsType !== 'scroll')

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
