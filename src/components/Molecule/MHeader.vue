<template>
  <header class="MHeader">
    <h1 class="MHeader__title">
      {{ title }}
    </h1>

    <h2 class="MHeader__subtitle">
      {{ subTitle }}
    </h2>
  </header>
</template>

<script lang="ts" setup>
  defineProps<{
    title: string,
    subTitle: string
  }>()
</script>

<style lang="scss">
  .MHeader {
    display: flex;
    flex-direction: column;
    gap: var(--spacer);
    left: 50%;
    max-width: 90vw;
    position: absolute;
    text-align: center;
    top: 4vh;
    transform: translateX(-50%);
    width: max-content;

    &__title {
      color: var(--color-light);
      font-size: 6rem;
      -webkit-text-stroke: 2px var(--color-primary);
    }

    &__subtitle {
      font-size: 3rem;
    }
  }
</style>
