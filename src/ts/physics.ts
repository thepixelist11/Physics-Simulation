require('./eclipse')
require('./primitives')
const gravity = 9.81

function updatePoints(deltaTime: number, points: Array<Point>) {
  for (let i = 0; i < points.length; i++) {
    const p = points[i]
    const currentPosition = p.position.copy()
    // Verlet integration equation: x[t+1] = 2x[t]-x[t-1] + a[t]∆t^2
    const newPosition = currentPosition
      .getMult(2)
      .getSub(p.lastPosition)
      .getAdd(Eclipse.Vector2.DOWN
        .getMult(gravity)
        .getMult(Math.pow(deltaTime, 2)))
    p.lastPosition = currentPosition.copy()
    p.position = newPosition.copy()
  }
}

module.exports = {
  gravity: gravity,
  updatePoints: updatePoints
}