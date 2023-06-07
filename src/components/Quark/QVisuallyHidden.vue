<template v-once>
  <span class="QVisuallyHidden">
    <slot />
  </span>
</template>

<script lang="ts" setup>
</script>

<style lang="scss">
  .QVisuallyHidden {

    // taken from bootstrap/scss/mixins/visually-hidden
    &:not(:focus):not(:focus-within) {
      border: 0 !important;
      clip: rect(0, 0, 0, 0) !important;
      height: 1px !important;
      margin: -1px !important; // Fix for https://github.com/twbs/bootstrap/issues/25686
      overflow: hidden !important;
      padding: 0 !important;
      position: absolute !important;
      white-space: nowrap !important;
      width: 1px !important;
    }
  }
</style>
