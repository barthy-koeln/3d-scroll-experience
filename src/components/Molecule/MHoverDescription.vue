<template>
  <div class="MHoverDescription">
    <h2>{{ title }}</h2>

    <p>{{ description }}</p>
  </div>
</template>

<script lang="ts" setup>
  defineProps<{
    title: string,
    description: string
  }>()
</script>

<style lang="scss">
  .MHoverDescription {
    background-color: #dedede;
    border-radius: 4px;
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    gap: var(--spacer);
    left: 0;
    max-width: 256px;
    padding: var(--spacer);
    pointer-events: none;
    position: fixed;
    top: 0;
    transform: translate3d(var(--pointer-x), var(--pointer-y), 1px);
    transition: var(--animation-duration) var(--animation-easing);
    transition-property: opacity, transform;
    user-select: none;
    will-change: transform;
    z-index: 10;
  }
</style>