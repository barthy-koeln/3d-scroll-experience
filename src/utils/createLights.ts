import { SpotLight } from 'three'

export function createPointLight (intensity: number, x: number, y: number, z: number) {
  const light = new SpotLight(0xffffff, intensity, 50, Math.PI / 3, 0, 2)

  light.position.set(x, y, z)
  light.target.position.set(0, 0, 0)

  light.castShadow = true

  light.shadow.mapSize.width = 512
  light.shadow.mapSize.height = 512
  light.shadow.bias = -0.0001

  return light
}
