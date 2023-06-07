import { ControlsInterface } from '@/services/controls/ControlsInterface'
import Lenis from '@studio-freight/lenis'
import { MAX_ANIMATION_FACTOR } from '@/constants'
import type { AnimationDirector } from '@/services/AnimationDirector'
import type { CameraOperator } from '@/services/CameraOperator'

export class ScrollControls extends ControlsInterface {
  private readonly lenis: Lenis

  constructor (animationDirector: AnimationDirector, cameraOperator: CameraOperator) {
    super(animationDirector, cameraOperator)

    this.lenis = new Lenis({
      duration: 1.2,
      orientation: 'vertical', // vertical, horizontal
      gestureOrientation: 'vertical', // vertical, horizontal, both
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false
    })

    this.lenis.on('scroll', this.onScroll)
  }

  async start (): Promise<void> {
    await this.cameraOperator.restore()
    this.lenis.start()
  }

  stop (): void {
    this.lenis.stop()

    if (!this.animationDirector.duration) {
      return
    }

    this.animationDirector.setTime(MAX_ANIMATION_FACTOR * this.animationDirector.duration)
  }

  update (time: number): void {
    if (this.lenis.isStopped) {
      return
    }

    this.lenis.raf(time)
  }

  onScroll = () => {
    if (!this.animationDirector.config || !this.animationDirector.duration) {
      return
    }

    const scrollFactor = Math.min(MAX_ANIMATION_FACTOR, this.lenis.progress)

    const currentFrame = Math.round(scrollFactor * this.animationDirector.config.frameCount)
    if (currentFrame !== this.animationDirector.currentFrame.value) {
      this.animationDirector.currentFrame.value = currentFrame
    }

    this.animationDirector.setTime(scrollFactor * this.animationDirector.duration)
  }
}
