<template>
  <div class="MControlsChooser">
    <AButton
      :active="mode === 'scroll'"
      @click="emit('update:mode', 'scroll')"
    >
      <span>Scroll</span>

      <IScroll/>
    </AButton>

    <AButton
      :active="mode === 'orbit'"
      @click="emit('update:mode', 'orbit')"
    >
      <span>Orbit</span>
      
      <IOrbit/>
    </AButton>

    <AButton
      :active="mode === 'fps'"
      @click="emit('update:mode', 'fps')"
    >
      <span>FPV + WASD / Arrows</span>

      <IArrows/>
    </AButton>
  </div>
</template>

<script lang="ts" setup>
  import AButton from '@/components/Atom/AButton.vue'
  import IScroll from "@/components/Icon/IScroll.vue";
  import IOrbit from "@/components/Icon/IOrbit.vue";
  import IArrows from "@/components/Icon/IArrows.vue";

  defineProps<{
    mode: 'scroll'|'orbit'|'fps'
  }>()

  const emit = defineEmits<{
    (e: 'update:mode', value: string): void
  }>()
</script>

<style lang="scss">
  .MControlsChooser {
    display: flex;
    gap: var(--spacer);
    opacity: .7;
    transition: opacity var(--animation-duration) var(--animation-easing);

    &:hover {
      opacity: 1;
    }
  }
</style>