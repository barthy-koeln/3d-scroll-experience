import { useEnvMap } from '@/utils/useEnvMap'
import { AmbientLight, Scene } from 'three'

export function useDefaultScene (): Scene {
  const envMap = useEnvMap()
  const scene = new Scene()

  scene.environment = envMap
  scene.add(new AmbientLight(0xffffff, 1))

  return scene
}