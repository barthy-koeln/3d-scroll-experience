<template>
  <button
    :data-active="active || undefined"
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
      },

      active: {
        type: Boolean,
        default: false
      }
    }
  })
</script>

<style lang="scss">
  @use "@/_variables.scss" as *;

  .AButton {
    --bg: var(--color-dark);
    --color: var(--color-secondary-light);

    align-items: center;
    background-color: var(--bg);
    color: var(--color);
    cursor: pointer;
    display: flex;
    gap: var(--spacer);
    padding-block: var(--spacer);
    padding-inline: var(--spacer-4);
    pointer-events: all;
    transition: $duration $easing;
    transition-property: opacity, color, background-color;

    &:hover,
    &:active,
    &[data-active] {
      --bg: var(--color-dark);
      --color: var(--color-primary-light);
    }

    svg {
      height: 2em;
      width: 2em;
    }
  }
</style>