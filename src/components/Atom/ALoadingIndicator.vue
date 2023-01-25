<template>
  <div class="ALoadingIndicator">
    <template
      v-for="index in 9"
      :key="index"
    >
      <div/>
    </template>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'ALoadingIndicator'
  })
</script>

<style lang="scss">
  @use "sass:math";
  @use "@/_variables.scss" as *;

  .ALoadingIndicator {
    $gap: 10px;
    $dotSize: 20px;
    $size: 3*$dotSize + 2*$gap;
    $duration: 1.2s;
    $duration-third: $duration / 3;

    display: grid;
    gap: $gap;
    grid-template-columns: 1fr 1fr 1fr;
    height: $size;
    position: relative;
    width: $size;

    div {
      animation: lds-grid $duration linear infinite;
      background: var(--color-light);
      border-radius: 50%;
      height: $dotSize;
      width: $dotSize;

      @for $index from 0 through 8 {
        $modulo: $index % 3;
        $row: math.floor(math.div($index, 3));

        &:nth-child(#{$index + 1}) {
          animation-delay: $row * $duration-third - $modulo * $duration-third;
        }
      }
    }

    @keyframes lds-grid {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  }
</style>B