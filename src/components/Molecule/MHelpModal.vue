<template>
  <div class="MHelpModal">
    <button
      class="MHelpModal__button"
      type="button"
      @click="showHelp = !showHelp"
    >
      <strong>&quest;</strong>

      <QVisuallyHidden>Help</QVisuallyHidden>
    </button>

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
  </div>
</template>

<script lang="ts">
  import QVisuallyHidden from '@/components/Quark/QVisuallyHidden.vue'
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'MHelpModal',
    components: { QVisuallyHidden },

    data () {
      return {
        showHelp: false
      }
    }
  })
</script>

<style lang="scss">
  @use "@/_variables.scss" as *;

  .MHelpModal {
    display: contents;

    &__button {
      cursor: pointer;
      left: spacer();
      padding: var(--spacer);
      position: fixed;
      top: spacer();
    }

    &__modal {
      left: 50%;
      position: fixed;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>