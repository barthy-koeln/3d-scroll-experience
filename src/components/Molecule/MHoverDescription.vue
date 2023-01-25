<template>
  <div class="MHoverDescription">
    <h2>{{ title }}</h2>

    <p>{{ description }}</p>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'MHoverDescription',

    props: {
      title: {
        type: String,
        required: true
      },

      description: {
        type: String,
        required: true
      }
    }
  })
</script>

<style lang="scss">
  @use "@/variables" as *;

  .MHoverDescription {
    background-color: #dedede;
    border-radius: 4px;
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    gap: spacer(3);
    left: 0;
    max-width: 256px;
    padding: spacer(3);
    pointer-events: none;
    position: fixed;
    top: 0;
    transform: translate3d(var(--pointer-x), var(--pointer-y), 1px);
    transition: $duration $easing;
    transition-property: opacity, transform;
    user-select: none;
    will-change: transform;
    z-index: 10;
  }
</style>