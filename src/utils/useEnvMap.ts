import nx from '@/assets/envmap/nx.webp'
import ny from '@/assets/envmap/ny.webp'
import nz from '@/assets/envmap/nz.webp'
import px from '@/assets/envmap/px.webp'
import py from '@/assets/envmap/py.webp'
import pz from '@/assets/envmap/pz.webp'
import type { CubeTexture } from 'three'
import { CubeTextureLoader } from 'three'

export function useEnvMap (): CubeTexture {
  const envMapLoader = new CubeTextureLoader()
  return envMapLoader.load([px, nx, py, ny, pz, nz])
}