<template>
  <RouterView
    v-slot="{ Component }"
    class="App"
  >
    <template v-if="Component">
      <Transition
        appear
        mode="out-in"
        name="fade"
      >
        <KeepAlive>
          <Suspense>
            <Component :is="Component" />

            <!-- loading state -->
            <template #fallback>
              <div class="App__loading">
                <ALoadingIndicator />
              </div>
            </template>
          </Suspense>
        </KeepAlive>
      </Transition>
    </template>
  </RouterView>
</template>

<script
  lang="ts"
  setup
>
  import ALoadingIndicator from '@/components/Atom/ALoadingIndicator.vue'
  import { RouterView } from 'vue-router'
</script>

<style lang="scss">
  .App {

    &__loading {
      align-items: center;
      background-color: var(--color-dark);
      display: flex;
      height: 100%;
      justify-content: center;
      position: fixed;
      width: 100%;
    }
  }
</style>
