<template>
  <header class="MHeader">
    <h1 class="MHeader__title">{{ title }}</h1>

    <h2 class="MHeader__subtitle">{{ subTitle }}</h2>
  </header>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'MHeader',

    props: {
      title: {
        type: String,
        required: true
      },

      subTitle: {
        type: String,
        required: true
      }
    }
  })
</script>

<style lang="scss">
  @use "@/_variables.scss" as *;

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
      font-size: 8rem;
      line-height: 5rem;
      -webkit-text-stroke: 2px var(--color-primary);
      text-transform: uppercase;
    }

    &__subtitle {
      font-size: 3rem;
      line-height: 2.8rem;
    }
  }
</style>