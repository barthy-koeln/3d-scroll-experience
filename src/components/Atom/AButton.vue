<template>
  <button
    class="AButton"
    type="button"
    v-bind="$attrs"
  >
    <template v-if="label">
      {{ label }}
    </template>

    <template v-else>
      <slot/>
    </template>
  </button>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'AButton',

    props: {
      label: {
        type: String,
        default: undefined
      }
    }
  })
</script>

<style lang="scss">
  @use "@/_variables.scss" as *;

  .AButton {
    --bg: var(--color-primary);

    background-color: var(--bg);
    color: var(--color-light);
    cursor: pointer;
    padding-block: spacer(3);
    padding-inline: spacer(4);
    transition: $duration $easing;
    transition-property: opacity, color, background-color;

    &:hover,
    &:active {
      --bg: var(--color-primary-light);
    }
  }
</style>