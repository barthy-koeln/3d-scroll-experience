import type { AnimationClip, AnimationMixer } from 'three'
import type { InjectionKey, Ref } from 'vue'
import { ref } from 'vue'

type AnimationDirectorConfig = {
  frameCount: number,
  framesPerSecond: number,
}

export class AnimationDirector {
  private mixer: AnimationMixer|null = null
  public config: AnimationDirectorConfig|null = null
  public duration: number|null = null
  public readonly currentFrame: Ref<number>

  constructor () {
    this.currentFrame = ref<number>(0)
  }

  public setConfig (config: AnimationDirectorConfig) {
    this.config = config
    this.duration = this.config.frameCount / this.config.framesPerSecond
  }

  public setMixer (mixer: AnimationMixer) {
    this.mixer = mixer
  }

  public addClips (clips: AnimationClip[]): void {
    if (!this.mixer) {
      return
    }

    for (const clip of clips) {
      clip.optimize()
      this.mixer.clipAction(clip).play()
    }
  }

  setTime (timeInSeconds: number): void {
    this.mixer?.setTime(timeInSeconds)
  }

  stopAnimation (): void {
    if (!this.mixer) {
      return
    }

    this.mixer.stopAllAction()
  }
}

export const AnimationDirectorService = Symbol('DISymbol') as InjectionKey<AnimationDirector>
