<template>
  <div class="AScrollHint">
    <svg
      aria-hidden="true"
      class="svg-inline--fa fa-mouse-alt fa-w-12"
      data-icon="mouse-alt"
      data-prefix="fad"
      focusable="false"
      role="img"
      viewBox="0 0 384 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g class="fa-group">
        <path
          class="fa-secondary"
          d="M224 0h-64A160 160 0 0 0 0 160v192a160 160 0 0 0 160 160h64a160 160 0 0 0 160-160V160A160 160 0 0 0 224 0zm0 160a32 32 0 0 1-64 0v-32a32 32 0 0 1 64 0z"
          fill="currentColor"
          opacity="0.4"
        ></path>

        <path
          class="fa-primary"
          d="M224 160a32 32 0 0 1-64 0v-32a32 32 0 0 1 64 0z"
          fill="currentColor"
        ></path>
      </g>
    </svg>

    <em class="AScrollHint__text">Scroll to animate</em>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss">
  .AScrollHint {
    align-items: center;
    animation: bounce 2.5s infinite;
    bottom: 4vh;
    display: flex;
    gap: 1rem;
    justify-content: center;
    position: absolute;
    width: 100%;

    @keyframes bounce {

      0%,
      50%,
      100% {
        transform: translateY(0);
      }

      25% {
        transform: translateY(5px);
      }
    }

    @keyframes wonky {

      0%,
      15%,
      100% {
        transform: rotate(0);
      }

      5% {
        transform: rotate(-5deg);
      }

      10% {
        transform: rotate(5deg);
      }
    }

    &__text {
      animation: wonky 2.5s infinite;
    }

    .fa-mouse-alt {
      width: 32px;

      .fa-primary {
        color: var(--color-primary);
      }

      .fa-secondary {
        color: var(--color-secondary);
      }
    }
  }
</style>