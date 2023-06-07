<template>
  <div class="MControlsChooser">
    <p>Try it out! You can interact with this demo.</p>

    <div class="MControlsChooser__buttons">
      <template
        v-for="(config, key) in configs"
        :key="key"
      >
        <AButton
          v-if="availableControls.includes(key)"
          :active="currentControlsType === key"
          @click="onClick(key)"
        >
          <span>{{ config.title }}</span>

          <Component :is="config.icon" />
        </AButton>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import AButton from '@/components/Atom/AButton.vue'
  import IScroll from '@/components/Icon/IScroll.vue'
  import IOrbit from '@/components/Icon/IOrbit.vue'
  import IArrows from '@/components/Icon/IArrows.vue'
  import type { Component } from 'vue'
  import { inject } from 'vue'
  import type { ControlsType } from '@/services/ControlsManager'
  import { ControlsManager, ControlsManagerService } from '@/services/ControlsManager'

  const controlsManager = inject<ControlsManager>(ControlsManagerService) as ControlsManager
  const { availableControls, currentControlsType } = controlsManager

  type ButtonConfig = {
    title: string,
    icon: Component
  }

  const configs: Record<ControlsType, ButtonConfig> = {
    scroll: {
      title: 'Scroll',
      icon: IScroll
    },
    orbit: {
      title: 'Orbit',
      icon: IOrbit
    },
    firstPerson: {
      title: 'FPV + WASD / Arrows',
      icon: IArrows
    }
  }

  function onClick (type: ControlsType) {
    controlsManager.switchControls(type)
  }
</script>

<style lang="scss">
  .MControlsChooser {
    display: flex;
    gap: var(--spacer);
    flex-direction: column;
    align-items: center;

    &__buttons {
      display: flex;
      gap: var(--spacer);
    }
  }
</style>
