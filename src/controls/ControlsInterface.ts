export type AnimationFactorCallback = (factor: number) => void
export type BeforeStartCallback = () => Promise<unknown>

export abstract class ControlsInterface {
  public abstract start(): Promise<void>
  public abstract stop(): void
  public abstract update(time: number, delta: number): void
}
