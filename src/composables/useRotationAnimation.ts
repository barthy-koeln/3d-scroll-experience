import { DURATION } from '@/constants'
import { Easing, Tween } from '@tweenjs/tween.js'
import type { Euler, Object3D } from 'three'

export type RotationAnimation = {
  update: (delta: number) => void,
  reset: () => Promise<Euler>
}

export function useRotationAnimation (RPM: number, target: Object3D, axis: 'x' | 'y' | 'z'): RotationAnimation {
  const angularSpeed = (RPM / 60) * Math.PI * 2
  const initial = target.rotation[axis]

  return {
    update (delta: number) {
      target.rotation[axis] -= delta * angularSpeed
    },
    reset () {
      return new Promise(resolve => {
        new Tween<Euler>(target.rotation)
          .duration(DURATION)
          .easing(Easing.Exponential.Out)
          .to({
            ...target.rotation,
            [axis]: initial
          })
          .onComplete(resolve)
      })
    }
  }
}
