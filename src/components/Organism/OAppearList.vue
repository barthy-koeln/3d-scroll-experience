<template>
  <div class="OAppearList">
    <TransitionGroup name="fade">
      <template
        v-for="item in filteredItems"
        :key="item.key"
      >
        <Component
          :is="item.component"
          :class="item.class"
          v-bind="item.props"
          v-on="item.on || {}"
        />
      </template>
    </TransitionGroup>
  </div>
</template>

<script lang="ts">
  import type { Component, PropType } from 'vue'
  import { defineComponent } from 'vue'

  export type ScrollRevealItem = {
    key: string,
    component: Component,

    class?: unknown,
    props: Record<string, unknown>,

    on?: Record<string, Function>,

    startFrame: number,
    endFrame: number
  }

  export default defineComponent({
    name: 'OAppearList',

    props: {
      items: {
        type: Array as PropType<ScrollRevealItem[]>,
        required: true
      },

      currentFrame: {
        type: Number,
        required: true
      }
    },

    computed: {
      filteredItems () {
        return this.items.filter((item: ScrollRevealItem) => {
          return item.startFrame <= this.currentFrame && this.currentFrame < item.endFrame
        })
      }
    }
  })
</script>

<style lang="scss">
  .OAppearList {
    aspect-ratio: 16 / 9;
    height: auto;
    left: 50%;
    max-height: 1080px;
    max-width: 1920px;
    pointer-events: none;
    position: fixed;
    top: 50%;
    transform: translate(-50%, -50%);
    user-select: none;
    width: 100%;
  }
</style>