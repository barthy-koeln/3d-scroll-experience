import type {AnimationClip, AnimationMixer} from "three";

export class AnimationDirector {

  private mixer: AnimationMixer|null = null

  public setMixer(mixer: AnimationMixer){
    this.mixer = mixer
  }

  public addClips(clips: AnimationClip[]): void {
    if(!this.mixer) {
      return
    }

    for(const clip of clips){
      clip.optimize()
      this.mixer.clipAction(clip).play()
    }
  }

  setTime(timeInSeconds: number): void {
    this.mixer?.setTime(timeInSeconds)
  }

  stopAnimation (): void {
    if(!this.mixer) {
      return
    }

    this.mixer.stopAllAction()
  }
}

export const AnimationDirectorService = Symbol()