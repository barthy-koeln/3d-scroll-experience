export function useCanvas () {
  const canvas = document.createElement('canvas')

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  function insertCanvas (element: ChildNode) {
    element.appendChild(canvas)
  }

  function removeCanvas () {
    canvas.remove()
  }

  return {
    canvas,
    insertCanvas,
    removeCanvas
  }
}