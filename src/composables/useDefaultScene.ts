import { createPointLight } from '@/utils/createLights'
import { Mesh, PlaneGeometry, Scene, ShadowMaterial, Texture } from 'three'

export function useDefaultScene (envMap: Texture): Scene {
  const scene = new Scene()

  scene.environment = envMap

  const planeGeometry = new PlaneGeometry(20, 20, 32, 32)
  const planeMaterial = new ShadowMaterial()
  const plane = new Mesh(planeGeometry, planeMaterial)
  plane.position.y = -.73
  plane.rotation.x = -Math.PI / 2
  plane.material.opacity = 0.2
  plane.receiveShadow = true
  scene.add(plane)

  const lights = [
    createPointLight(200, -4, 4.9, 8), // BACK
    createPointLight(200, 11, 4.9, -4), // FILL
    createPointLight(300, 3, 4.9, -14) // KEY
  ]

  lights.map(light => scene.add(light))

  return scene
}