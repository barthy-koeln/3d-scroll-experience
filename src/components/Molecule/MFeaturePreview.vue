<template>
  <div
    :data-section="index"
    class="MFeaturePreview"
  >
    <h2 class="MFeaturePreview__title">
      <em>STEP {{ index + 1 }}:</em>

      <br/>

      <span>{{ title }}</span>
    </h2>

    <p class="MFeaturePreview__paragraph">{{ paragraph }}</p>
  </div>
</template>

<script lang="ts" setup>
  defineProps<{
    index: number,
    title: string,
    paragraph: string
  }>()
</script>

<style lang="scss">
  @keyframes wobble {
    0% {
      transform: translate(0, 0px);
      box-shadow: 0 10px 10px 0 rgb(0 0 0 / 60%);
    }
    50% {
      transform: translate(0, -5px);
      box-shadow: 0 10px 60px 0 rgb(0 0 0 / 60%);
    }
    100% {
      transform: translate(0, -0px);
      box-shadow: 0 10px 10px 0 rgb(0 0 0 / 60%);
    }
  }

  .MFeaturePreview {
    display: flex;
    flex-direction: column;
    gap: var(--spacer);
    padding: 64px;
    position: absolute;
    width: 512px;

    &::before {
      animation: wobble 4s infinite;
      animation-fill-mode: both;
      background-image: linear-gradient(45deg, var(--color-secondary) 0%, var(--color-primary) 100%);
      border-radius: var(--border-radius);
      content: "";
      inset: 0 0 0 0;
      overflow: hidden;
      position: absolute;
    }

    &__title {
      font-size: 2.4rem;
    }

    &__paragraph {
      font-size: 1.4rem;
      line-height: 1.2;
    }
  }
</style>