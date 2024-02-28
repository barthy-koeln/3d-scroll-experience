import type { AnimationFactorCallback, BeforeStartCallback } from '@/controls/ControlsInterface'
import { ControlsInterface } from '@/controls/ControlsInterface'
import Lenis from '@studio-freight/lenis'
import { MAX_ANIMATION_FACTOR } from '@/constants'

export class ScrollControls extends ControlsInterface {
  private readonly lenis: Lenis
  private readonly setAnimationFactor: AnimationFactorCallback
  private readonly beforeStart: BeforeStartCallback

  constructor (setAnimationFactor: AnimationFactorCallback, beforeStart: BeforeStartCallback) {
    super()

    this.setAnimationFactor = setAnimationFactor
    this.beforeStart = beforeStart
    this.lenis = new Lenis({
      duration: 1.2,
      orientation: 'vertical', // vertical, horizontal
      gestureOrientation: 'vertical', // vertical, horizontal, both
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false
    })

    this.lenis.on('scroll', this.onScroll)
  }

  async start (): Promise<void> {
    await this.beforeStart()
    this.lenis.start()
  }

  stop (): void {
    this.lenis.stop()
    this.setAnimationFactor(MAX_ANIMATION_FACTOR)
  }

  update (time: number): void {
    if (this.lenis.isStopped) {
      return
    }

    this.lenis.raf(time)
  }

  onScroll = () => {
    const scrollFactor = Math.min(MAX_ANIMATION_FACTOR, this.lenis.progress)
    this.setAnimationFactor(scrollFactor)
  }
}
