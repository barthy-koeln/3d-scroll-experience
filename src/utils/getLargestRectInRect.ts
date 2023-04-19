type Rectangle = {
  width: number,
  height: number
}

/**
 * Returns the largest possible rectangle in another rectangle while keeping the aspect ratio
 */
export function getLargestRectInRect (source: Rectangle, destination: Rectangle): Rectangle {
  const scale = Math.min(destination.width / source.width, destination.height / source.height)

  return {
    width: source.width * scale,
    height: source.height * scale
  }
}