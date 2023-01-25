import { useEnvMap } from '@/utils/useEnvMap'
import { AmbientLight, DirectionalLight, Scene } from 'three'

export function useDefaultScene (): Scene {
  const envMap = useEnvMap()
  const scene = new Scene()

  scene.environment = envMap
  scene.add(new AmbientLight(0xffffff, 2))

  const sun = new DirectionalLight(0xffffcc, 2)
  sun.position.set(0, 1, 0)
  scene.add(sun)

  return scene
}