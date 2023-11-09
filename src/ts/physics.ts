require('./eclipse')
require('./primitives')
require('./grid')

const gravity = 9.81

function updatePoints(deltaTime: number, grid: Grid, pxPerM: number) {
  const points = grid.points
  for (let i = 0; i < points.length; i++) {
    const p = points[i]
    const currentPosition = p.position.copy()
    // Verlet integration equation: x[t+1] = 2x[t]-x[t-1] + a[t]∆t^2
    const newPosition = currentPosition
      .getMult(2)
      .getSub(p.lastPosition)
      .getAdd(Eclipse.Vector2.DOWN
        .getMult(gravity * pxPerM)
        .getMult(deltaTime ** 2))
    p.lastPosition = currentPosition.copy()
    p.position = newPosition.copy()
  }
  grid.updateCells()
}

module.exports = {
  gravity: gravity,
  updatePoints: updatePoints
}