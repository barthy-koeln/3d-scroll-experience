<template>
  <button
    :data-active="active || undefined"
    class="AButton"
    type="button"
    v-bind="$attrs"
    @click="$emit('click')"
  >
    <template v-if="label">
      {{ label }}
    </template>

    <template v-else>
      <slot />
    </template>
  </button>
</template>

<script lang="ts" setup>
  defineEmits(['click'])

  defineProps<{
    label?: string,
    active: boolean
  }>()
</script>

<style lang="scss">
  .AButton {
    --bg: var(--color-dark);
    --color: var(--color-light);

    align-items: center;
    background-color: var(--bg);
    color: var(--color);
    cursor: pointer;
    display: flex;
    gap: var(--spacer);
    padding-block: var(--spacer);
    padding-inline: var(--spacer-4);
    pointer-events: all;
    transition: var(--animation-duration) var(--animation-easing);
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
