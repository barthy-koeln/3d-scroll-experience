<template>
  <div class="PHome">
    <Transition
      mode="out-in"
      name="fade"
    >
      <Suspense>
        <template #default>
          <OInterActiveScene
            :active-object="activeObject"
            :hover-object="hoverObject"
            :interactive-element-names="[
                  'top_floor',
                  'bottom_floor',
                  'roof'
                ]"
            model-url="/models/monica_lubenau/monica_lubenau.gltf"
            @pointerdown.passive="on3dPointerDown"
            @pointermove.passive="on3dPointerMove"
            @pointerup.passive="on3dPointerUp"
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
    </div>
  </div>
</template>

<script lang="ts">
  import ALoadingIndicator from '@/components/Atom/ALoadingIndicator.vue'
  import MHoverDescription from '@/components/Molecule/MHoverDescription.vue'
  import OInterActiveScene from '@/components/Organism/OInteractiveScene.vue'
  import type { Object3D } from 'three'
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'PHome',

    components: {
      MHoverDescription,
      ALoadingIndicator,
      OInterActiveScene
    },

    data () {
      return {
        hoverObject: null as Object3D | null,
        activeObject: null as Object3D | null,
        pointerDownTime: null as number | null,
        pointerX: null as number | null,
        pointerY: null as number | null,
        hoverTimeout: null as number | null
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

    methods: {
      on3dPointerMove (event: MouseEvent) {
        this.pointerX = Math.round(event.clientX)
        this.pointerY = Math.round(event.clientY)
      },

      on3dPointerDown () {
        this.pointerDownTime = performance.now()
      },

      on3dPointerUp () {
        if (!this.pointerDownTime) {
          return
        }

        const delta = performance.now() - this.pointerDownTime
        if (delta < 150) {
          this.on3dClick()
        }
      },

      on3dClick () {
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