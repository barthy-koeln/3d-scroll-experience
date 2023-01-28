<template>
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
