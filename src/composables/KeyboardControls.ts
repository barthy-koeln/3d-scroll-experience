import { Vector3 } from 'three'

export type ControlsOptions = {
  sprintFactor: number,
  crouchFactor: number
}

export class KeyboardControls {

  velocity = new Vector3(0, 0, 0)
  appliedSpeedFactor = 1

  keys = new Set()

  options: ControlsOptions
  element: HTMLElement

  constructor (element: HTMLElement, options: ControlsOptions) {
    this.element = element
    this.options = options
  }

  /**
   * Add Event Listeners
   */
  public start () {
    this.keys.clear()
    window.addEventListener('keydown', this.keyListener)
    window.addEventListener('keyup', this.keyListener)
  }

  /**
   * Remove Event Listeners
   */
  public stop () {
    window.removeEventListener('keydown', this.keyListener)
    window.removeEventListener('keyup', this.keyListener)
    this.keys.clear()
  }

  public isVelocityActive () {
    return this.keys.size !== 0
  }

  /**
   * Handle local and remote keyboard events
   */
  private keyListener = (event: KeyboardEvent) => {
    if (event.repeat) {
      return
    }

    const lowercaseKey = event.code.toLowerCase()
    switch (event.type) {
      case 'keydown':
        this.keys.add(lowercaseKey)
        break
      case 'keyup':
        this.keys.delete(lowercaseKey)
        break
    }


    this.applyFactors()
    this.updateVelocity()
  }

  private updateVelocity () {
    this.setAxisVelocity('x', ['keyd', 'arrowright'], ['keya', 'arrowleft'])
    this.setAxisVelocity('z', ['keys', 'arrowdown'], ['keyw', 'arrowup'])
    this.velocity.multiplyScalar(this.appliedSpeedFactor)
  }

  private applyFactors () {
    if (this.keys.has('shiftleft')) {
      this.appliedSpeedFactor = this.options.sprintFactor
      return
    }

    if (this.keys.has('keyc')) {
      this.appliedSpeedFactor = this.options.crouchFactor
      return
    }

    this.appliedSpeedFactor = 1
  }

  /**
   * Calculate the velocity for one axis based on two keys
   */
  private setAxisVelocity = (axis: 'x' | 'y' | 'z', positiveMovementKeys: string[], negativeMovementKeys: string[]) => {
    const hasNegative = negativeMovementKeys.some(value => this.keys.has(value))
    const hasPositive = positiveMovementKeys.some(value => this.keys.has(value))

    if (hasNegative === hasPositive) {
      this.velocity[axis] = 0
      return
    }

    this.velocity[axis] = hasNegative ? -1 : 1
  }
}