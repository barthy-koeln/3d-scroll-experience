<template>
  <div class="MHelpModal">
    <button
      class="MHelpModal__button"
      type="button"
      @click="toggle"
    >
      <strong>&quest;</strong>

      <QVisuallyHidden>Help</QVisuallyHidden>
    </button>

    <Teleport to="body">
      <Transition
        mode="out-in"
        name="fade"
      >
        <template v-if="showHelp">
          <div class="MHelpModal__modal">
            <h3>Camera Controls</h3>

            <p>Left mouse button to rotate, right mouse button to pan. Middle mouse button and wheel to zoom.</p>
          </div>
        </template>
      </Transition>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
  import QVisuallyHidden from '@/components/Quark/QVisuallyHidden.vue'
  import { ref } from 'vue'

  const showHelp = ref<boolean>(false)

  function toggle () {
    showHelp.value = !showHelp.value
  }
</script>

<style lang="scss">
  .MHelpModal {
    display: contents;

    &__button {
      cursor: pointer;
      left: var(--spacer);
      padding: var(--spacer);
      position: fixed;
      top:  var(--spacer);
    }

    &__modal {
      left: 50%;
      position: fixed;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>
