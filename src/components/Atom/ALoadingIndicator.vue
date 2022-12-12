<template>
  <div class="ALoadingIndicator">
    <div></div>

    <div></div>

    <div></div>

    <div></div>

    <div></div>

    <div></div>

    <div></div>

    <div></div>

    <div></div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'ALoadingIndicator'
  })
</script>

<style lang="scss">
  @use "@/_variables.scss" as *;

  .ALoadingIndicator {
    display: inline-block;
    height: 80px;
    position: relative;
    width: 80px;

    div {
      animation: lds-grid 1.2s linear infinite;
      background: #fff;
      border-radius: 50%;
      height: 16px;
      position: absolute;
      width: 16px;
    }

    div:nth-child(1) {
      animation-delay: 0s;
      left: 8px;
      top: 8px;
    }

    div:nth-child(2) {
      animation-delay: -0.4s;
      left: 32px;
      top: 8px;
    }

    div:nth-child(3) {
      animation-delay: -0.8s;
      left: 56px;
      top: 8px;
    }

    div:nth-child(4) {
      animation-delay: -0.4s;
      left: 8px;
      top: 32px;
    }

    div:nth-child(5) {
      animation-delay: -0.8s;
      left: 32px;
      top: 32px;
    }

    div:nth-child(6) {
      animation-delay: -1.2s;
      left: 56px;
      top: 32px;
    }

    div:nth-child(7) {
      animation-delay: -0.8s;
      left: 8px;
      top: 56px;
    }

    div:nth-child(8) {
      animation-delay: -1.2s;
      left: 32px;
      top: 56px;
    }

    div:nth-child(9) {
      animation-delay: -1.6s;
      left: 56px;
      top: 56px;
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
</style>