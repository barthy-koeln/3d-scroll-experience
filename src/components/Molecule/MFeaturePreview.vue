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
    background-image: linear-gradient(45deg, var(--color-secondary) 0%, var(--color-primary) 100%);
    display: flex;
    flex-direction: column;
    gap: var(--spacer);
    overflow: hidden;
    padding: 64px;
    position: absolute;
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
      border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
      left: 4%;
      top: 4%;
    }

    &[data-section="1"] {
      border-radius: 76% 24% 78% 22% / 30% 70% 30% 70%;
      bottom: 70%;
      right: 4%;
    }

    &[data-section="2"] {
      border-radius: 22% 78% 54% 46% / 55% 55% 45% 45%;
      bottom: 62.5%;
      left: 20%;
    }

    &[data-section="3"] {
      border-radius: 26% 74% 70% 30% / 74% 79% 21% 26%;
      bottom: 25%;
      right: 4%;
    }

    &[data-section="4"] {
      border-radius: 24% 76% 63% 37% / 81% 55% 45% 19%;
      bottom: 4%;
      left: 4%;
    }
  }
</style>