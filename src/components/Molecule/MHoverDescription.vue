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
    bottom: spacer(3);
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    gap: spacer(3);
    max-width: 256px;
    padding: spacer(3);
    position: fixed;
    right: spacer(3);
    transform: translate3d(0, 0, 1px);
    z-index: 10;
  }
</style>