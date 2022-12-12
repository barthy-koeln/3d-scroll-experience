import { AmbientLight, CubeTexture, GridHelper, Object3D, Scene } from 'three'

export function useDefaultScene (envMap: CubeTexture, objects: Object3D[] = []): Scene {
  const scene = new Scene()

  scene.environment = envMap

  const gridHelper = new GridHelper(500, 50)
  gridHelper.position.set(0, -1, 0)

  scene.add(gridHelper)
  scene.add(new AmbientLight(0xffffff, 2))
  scene.add(...objects)

  return scene
}