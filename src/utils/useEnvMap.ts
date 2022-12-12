import nx from '@/assets/envmap/nx.png'
import ny from '@/assets/envmap/ny.png'
import nz from '@/assets/envmap/nz.png'
import px from '@/assets/envmap/px.png'
import py from '@/assets/envmap/py.png'
import pz from '@/assets/envmap/pz.png'
import type { CubeTexture } from 'three'
import { CubeTextureLoader } from 'three'

export function useEnvMap (): CubeTexture {
  const envMapLoader = new CubeTextureLoader()
  return envMapLoader.load([px, nx, py, ny, pz, nz])
}