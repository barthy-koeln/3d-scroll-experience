import { useEnvMap } from '@/utils/useEnvMap'
import { AmbientLight, GridHelper, Scene } from 'three'

export function useDefaultScene (): Scene {
  const envMap = useEnvMap()
  const scene = new Scene()

  scene.environment = envMap

  const gridHelper = new GridHelper(500, 50)
  gridHelper.position.set(0, -1, 0)

  scene.add(gridHelper)
  scene.add(new AmbientLight(0xffffff, 2))

  return scene
}