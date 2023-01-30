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
          :style="item.style"
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
    style?: unknown,
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
    height: var(--camera-view-height);
    left: var(--camera-view-offset-x);
    pointer-events: none;
    position: fixed;
    top: var(--camera-view-offset-y);
    user-select: none;
    width: var(--camera-view-width);
  }
</style>