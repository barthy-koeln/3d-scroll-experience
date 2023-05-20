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

<script lang="ts" setup>
  import {computed} from 'vue'
  import type {ScrollRevealItem} from "@/types";

  const props = defineProps<{
    items: ScrollRevealItem[],
    currentFrame: number
  }>()

  const filteredItems = computed<ScrollRevealItem[]>(() => {
    return props.items.filter((item: ScrollRevealItem) => {
      return item.startFrame <= props.currentFrame && props.currentFrame < item.endFrame
    })
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