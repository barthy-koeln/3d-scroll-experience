import { createPointLight } from '@/utils/createLights'
import { Mesh, PlaneGeometry, Scene, ShadowMaterial, Texture } from 'three'

export function useDefaultScene (envMap: Texture): Scene {
  const scene = new Scene()

  scene.environment = envMap

  const planeGeometry = new PlaneGeometry(50, 50, 32, 32)
  const planeMaterial = new ShadowMaterial()
  const plane = new Mesh(planeGeometry, planeMaterial)
  plane.position.y = 0
  plane.rotation.x = -Math.PI / 2
  plane.material.opacity = 0.2
  plane.receiveShadow = true

  scene.add(createPointLight(100, -1, 1, 1)) // BACK
  scene.add(createPointLight(100, 2, 1, -1)) // FILL
  scene.add(createPointLight(150, 1, 1, 2)) // KEY
  scene.add(plane)

  return scene
}
