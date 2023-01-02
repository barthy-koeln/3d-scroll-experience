export function useCanvas (): HTMLCanvasElement {
  const canvas = document.createElement('canvas')

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  return canvas
}