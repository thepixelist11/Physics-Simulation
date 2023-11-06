require('./eclipse')
require('./primitives')

type cellPositions = {
  left: number,
  right: number,
  top: number,
  bottom: number,
}

class Grid {
  #cells = new Map<String, Array<Point>>()
  #points = Array<Point>()
  #cellSize
  constructor(points: Array<Point>, cellSize: number) {
    this.#cellSize = cellSize
    this.#points = points

    this.updateCells()
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
    for(let i = 0; i < this.#points.length; i++) {
      const p = this.#points[i]
      const posCellIndicies = this.#possibleCellIndicies(p)
      for(let j = posCellIndicies.left; j <= posCellIndicies.right; j++) {
        for(let k = posCellIndicies.top; k <= posCellIndicies.bottom; k++) {
          const gridPosition = new Eclipse.Vector2(
              j * this.#cellSize + (this.cellSize / 2),
              k * this.#cellSize + (this.cellSize / 2)
            )
            const cellPos = new Eclipse.Vector2(j, k)
          // Checks if any part of the point is inside the grid cell
          if(gridPosition.dist(p.position) <= p.radius + ((this.#cellSize) / 2)) {
            if(this.#cells.has(cellPos.toString())) {
              let existingPoints = this.#cells.get(cellPos.toString())
              existingPoints?.push(p)
              if(existingPoints) {
                this.#cells.set(cellPos.toString(), existingPoints)
              }
            } else {
              this.#cells.set(cellPos.toString(), [p])
            }
          }
        }
      }
    }
  }

  #possibleCellIndicies(p: Point): cellPositions
  #possibleCellIndicies(id: number): cellPositions
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