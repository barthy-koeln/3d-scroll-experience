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

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'MFeaturePreview',

    props: {
      index: {
        type: Number,
        required: true
      },

      title: {
        type: String,
        required: true
      },

      paragraph: {
        type: String,
        required: true
      }
    }
  })
</script>

<style lang="scss">
  @use "@/_variables.scss" as *;

  .MFeaturePreview {
    display: flex;
    flex-direction: column;
    gap: var(--spacer);
    position: fixed;
    width: 512px;

    &__title {
      font-size: 3rem;
      line-height: 2.8rem;
      text-transform: uppercase;
    }

    &__paragraph {
      font-size: 1.8rem;
      line-height: 1.2;
    }

    &[data-section="0"] {
      bottom: 40vh;
      left: 5vw;
    }

    &[data-section="1"] {
      bottom: 70vh;
      right: 5vw;
    }

    &[data-section="2"] {
      bottom: 62.5vh;
      left: 5vw;
    }

    &[data-section="3"] {
      bottom: 25vh;
      right: 5vw;
    }

    &[data-section="4"] {
      left: 5vw;
      top: 5vh;
    }
  }
</style>