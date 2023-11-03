require('./eclipse')
require('./primitives')

type cellIndicies = {
  left: number,
  right: number,
  top: number,
  bottom: number,
}

class Grid {
  #cells = new Map<String, Array<Number>>()
  #points = Array<Point>()
  #cellSize
  constructor(points: Array<Point>, cellSize = 100) {
    this.#cellSize = cellSize
    this.#points = points
  }

  get points() {
    return this.#points
  }

  get cells() {
    return this.#cells
  }

  get cellSize() {
    return this.#cellSize
  }

  addPoint(p: Point) {
    this.#points.push(p)
    this.updateCells()
  }
  
  updateCells() {
    let cells = []
    for(let i = 0; i < this.#points.length; i++) {
      const p = this.#points[i]
      const posCellI = this.#possibleCellIndicies(p)
      for(let j = posCellI.left; j <= posCellI.right; j++) {
        for(let k = posCellI.top; k <= posCellI.bottom; k++) {
          const gridPosition = new Eclipse.Vector2(
              j * this.#cellSize + (this.cellSize / 2),
              k * this.#cellSize + (this.cellSize / 2)
            )
          // Checks if the distance between the centre of the grid cell and the point
          // is less than or equal to the radius + half the cell size.
          if(gridPosition.dist(p.position) <= p.radius + ((this.#cellSize) / 2)) {
            cells.push(new Eclipse.Vector2(j, k))
          }
        }
      }
    }
    return cells
  }

  #possibleCellIndicies(p: Point): cellIndicies
  #possibleCellIndicies(id: number): cellIndicies
  #possibleCellIndicies(point: number | Point) {
    let p: Point
    if(typeof point === 'number') {
      p = this.#points[point]
    } else {
      p = point
    }
    return {
      // Right and bottom would be 1 more than necessary if point is right on the edge.
      // Subtract by 1 to avoid any unecessary checks
      left: Math.floor(p.rect.left / this.#cellSize),
      top: Math.floor(p.rect.top / this.#cellSize),
      right: p.rect.right % this.#cellSize === 0 ? 
             Math.floor(p.rect.right / this.#cellSize) - 1 : 
             Math.floor(p.rect.right / this.#cellSize),
      bottom: p.rect.bottom % this.#cellSize === 0 ? 
              Math.floor(p.rect.bottom / this.#cellSize) - 1 : 
              Math.floor(p.rect.bottom / this.#cellSize),
    }
  }
}

module.exports = {
  Grid: Grid,
}