import { defineStore } from 'pinia'
import { AnimationClip, AnimationMixer } from 'three'
import { ref, shallowRef } from 'vue'

type AnimationDirectorConfig = {
  frameCount: number,
  framesPerSecond: number,
}

export const useAnimationsStore = defineStore('animations', () => {
  const mixer = shallowRef<AnimationMixer|null>()
  const config = shallowRef<AnimationDirectorConfig>()
  const duration = ref<number>(0)
  const currentFrame = ref<number>(0)

  function setConfig (newConfig: AnimationDirectorConfig) {
    config.value = newConfig
    duration.value = config.value.frameCount / config.value.framesPerSecond
  }

  function setMixer (newMixer: AnimationMixer) {
    mixer.value = newMixer
  }

  function addClips (clips: AnimationClip[]): void {
    if (!mixer.value) {
      return
    }

    for (const clip of clips) {
      clip.optimize()
      mixer.value.clipAction(clip).play()
    }
  }

  function setFactor (factor: number) {
    const frameCount = config.value?.frameCount || 0
    const newFrame = Math.round(factor * frameCount)

    mixer.value?.setTime(factor * duration.value)

    if (newFrame !== currentFrame.value) {
      currentFrame.value = Math.round(factor * frameCount)
    }
  }

  return {
    mixer,
    config,
    duration,
    currentFrame,
    setFactor,
    setConfig,
    setMixer,
    addClips
  }
})
