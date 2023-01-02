<template>
  <div class="PHome">
    <Transition
      mode="out-in"
      name="fade"
    >
      <Suspense @resolve="onSceneLoaded">
        <template #default>
          <OInterActiveScene
            ref="scene"
            :active-object="activeObject"
            :hover-object="hoverObject"
            :interactive-element-names="[
                  'top_floor',
                  'bottom_floor',
                  'roof'
                ]"
            model-url="/models/monica_lubenau/monica_lubenau.gltf"
            @click="onClick"
            @update:hover="onUpdateHover"
          />
        </template>

        <template #fallback>
          <ALoadingIndicator class="PHome__loading"/>
        </template>
      </Suspense>
    </Transition>

    <div>
      <Transition
        mode="out-in"
        name="fade"
      >
        <template v-if="hoverMeta">
          <MHoverDescription
            :description="hoverMeta.description"
            :title="hoverMeta.title"
          />
        </template>
      </Transition>

      <button
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
          <MHoverDescription
            description="Left mouse button to rotate, right mouse button to pan. Middle mouse button and wheel to zoom."
            title="Camera Controls"
          />
        </template>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts">
  import ALoadingIndicator from '@/components/Atom/ALoadingIndicator.vue'
  import MHoverDescription from '@/components/Molecule/MHoverDescription.vue'
  import OInterActiveScene from '@/components/Organism/OInteractiveScene.vue'
  import QVisuallyHidden from '@/components/Quark/QVisuallyHidden.vue'
  import { useObjectDetailView } from '@/utils/useObjectDetailView'
  import type { Object3D } from 'three'
  import { defineComponent, ref, toRaw } from 'vue'

  export default defineComponent({
    name: 'PHome',

    components: {
      QVisuallyHidden,
      MHoverDescription,
      ALoadingIndicator,
      OInterActiveScene
    },

    data () {
      return {
        hoverObject: null as Object3D | null,
        activeObject: null as Object3D | null,
        showHelp: false
      }
    },

    computed: {
      hoverMeta () {
        if (!this.hoverObject) {
          return null
        }

        return {
          'top_floor': {
            title: 'Top Floor',
            description: 'Three bedrooms, two baths and a luxurious balcony.'
          },

          'roof': {
            title: 'Roof',
            description: 'It will probably fall to pieces as soon as it snows, since nothing can fall off the side. Good thing this looks like a Californian Villa.'
          },

          'bottom_floor': {
            title: 'Bottom Floor',
            description: 'Large open living room and kitchen, household utility rooms and a guest bedroom.'
          }
        }[this.hoverObject.name]
      }
    },


    setup () {
      const scene = ref<InstanceType<typeof OInterActiveScene> | null>(null)

      return {
        scene,
        ...useObjectDetailView(scene)
      }
    },

    watch: {
      activeObject (newActiveObject, previousActiveObject) {
        if (!this.scene) {
          return
        }

        const rawNewActive = toRaw(newActiveObject)
        const rawPreviousActive = toRaw(previousActiveObject)

        this.toggleActiveObject(this.scene.interactiveObjects, rawNewActive, rawPreviousActive)
      }
    },

    methods: {
      onClick () {
        if (!this.hoverObject) {
          return
        }

        if (this.hoverObject === this.activeObject) {
          this.activeObject = null
          return
        }

        this.activeObject = this.hoverObject
      },

      onUpdateHover (object: Object3D | null) {
        this.hoverObject = object
      },

      async onSceneLoaded () {
        await this.$nextTick()
        // this.$refs.scene.stopOrbitControls()
      }
    }
  })
</script>

<style lang="scss">
  @use "@/variables" as *;

  .PHome {
    background-color: #181818;
    height: 100vh;
    inset: 0 0 0 0;
    position: fixed;
    width: 100vw;

    &__loading {
      left: 50%;
      position: fixed;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>