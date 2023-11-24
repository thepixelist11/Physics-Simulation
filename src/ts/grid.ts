require('./eclipse')
require('./primitives')

type cellPositions = {
  left: number,
  right: number,
  top: number,
  bottom: number,
}

class Grid {
  #cells = new Map<string, Array<Point>>()
  #points = Array<Point>()
  #cellSize
  // The cells that every point is in
  #pointsCells = new Map<number, Array<string>>()
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
  set cellSize(newCellSize) {
    this.#cellSize = newCellSize
  }
  
  get pointsCells() {
    return this.#pointsCells
  }

  addPoint(p: Point) {
    if(this.containsPoint(p) === -1) {
      this.#points.push(p)  
      this.updateCells()
      return true
    }
    return false
  }

  removePoint(p: Point): boolean
  removePoint(p: number): boolean
  removePoint(p: Point | number) {
    if(p instanceof Point) {
      const index = this.containsPoint(p)
      if(index !== -1) {
        this.points.splice(index, 1)
        this.updateCells()
        return true
      } else {
        return false
      }
    } else {
      if(this.points.splice(p, 1)) {
        this.updateCells()
        return true
      } else {
        return false
      }
    }
  }

  updateCells() {
    // Clear cells to prevent adding points multiple times
    this.clearCells()
    for(let i = 0; i < this.#points.length; i++) {
      const p = this.#points[i]
      const pointIdentifier = p.identifier
      const posCellIndicies = this.#possibleCellIndicies(p)
      for(let j = posCellIndicies.left; j <= posCellIndicies.right; j++) {
        for(let k = posCellIndicies.top; k <= posCellIndicies.bottom; k++) {
          const gridPosition = new Eclipse.Vector2(
              j * this.#cellSize + (this.cellSize / 2),
              k * this.#cellSize + (this.cellSize / 2)
            )
            const cellPos = new Eclipse.Vector2(j, k)
          // Checks if any part of the point is inside the grid cell
          if(gridPosition.dist(p.position) <= p.radius + (this.#cellSize * Math.SQRT1_2)) {
            if(this.#pointsCells.has(pointIdentifier)) {
              let existingCells = this.#pointsCells.get(pointIdentifier)
              existingCells?.push(cellPos.toString())
            } else {
              this.#pointsCells.set(pointIdentifier, [cellPos.toString()])
            }
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

  clearCells() {
    this.#cells = new Map<string, Array<Point>>()
    this.#pointsCells = new Map<number, Array<string>>()
  }

  clearAllPoints() {
    this.#cells = new Map<string, Array<Point>>()
    this.#pointsCells = new Map<number, Array<string>>()
    this.#points = Array<Point>()
  }

  pointOverlapping(p: Point) {
    // FIXME: Implement spacial partitioning
    for(const other of this.points) {
      if(p.identifier !== other.identifier) {
        const totalRadii = p.radius + other.radius
        if(totalRadii >= p.position.dist(other.position)) return true
      }
    }
    return false
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
             Math.floor(p.rect.right / this.#cellSize) - 0 : 
             Math.floor(p.rect.right / this.#cellSize),
      bottom: p.rect.bottom % this.#cellSize === 0 ? 
              Math.floor(p.rect.bottom / this.#cellSize) - 0 : 
              Math.floor(p.rect.bottom / this.#cellSize),
    }
  }

  /**
   * Returns -1 if the grid does not contain the point specified.
   * Returns the index of the first identical point otherwise. 
   */
  containsPoint(p: Point) {
    for(let i = 0; i < this.#points.length; i++) {
      if(this.#points[i].isSameAs(p)) return i
    }
    return -1
  }

  get totalDynamic() {
    let total = 0
    for(let i = 0; i < this.#points.length; i++) {
      if(!this.#points[i].isStatic) total++
    }
    return total
  }

  get totalStatic() {
    let total = 0
    for(let i = 0; i < this.#points.length; i++) {
      if(this.#points[i].isStatic) total++
    }
    return total
  }
}

module.exports = {
  Grid: Grid,
}