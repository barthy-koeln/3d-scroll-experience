<template>
  <div class="IIcon ISpinner">
    <div class="ISpinner__container ISpinner__ring">
      <div class="ISpinner__first ISpinner__ring" />

      <div class="ISpinner__ring ISpinner__second" />
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss">
.ISpinner {

  .ISpinner__container {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .ISpinner__ring {
    height: 100%;
    width: 100%;
  }

  .ISpinner__first,
  .ISpinner__second {
    border: 4px solid var(--color-primary);
    border-radius: 100%;
    opacity: .4;
  }

  .ISpinner__first {
    animation: ISpinner__ringRightRotate 2s 0s infinite linear;
    animation-fill-mode: forwards;
    perspective: 800px;
    position: absolute;
    top: 0;
    left: 0;
  }

  .ISpinner__second {
    animation: ISpinner__ringLeftRotate 2s 0s infinite linear;
    animation-fill-mode: forwards;
    perspective: 800px;
    position: absolute;
    top: 0;
    left: 0;
  }
}

@keyframes ISpinner__ringRightRotate
{
  0% {
    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(180deg) rotateY(360deg) rotateZ(360deg);
  }
}

@keyframes ISpinner__ringLeftRotate
{
  0% {
    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(360deg) rotateY(180deg) rotateZ(360deg);
  }
}
</style>
