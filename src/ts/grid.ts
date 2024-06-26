require('./eclipse')
require('./primitives')

type cellPositions = {
  left: number
  right: number
  top: number
  bottom: number
}

class Grid {
  #cells = new Map<string, Array<Point>>()
  #points = Array<Point>()
  #cellSize
  #walls: Array<Wall>
  // The cells that every point is in
  #pointsCells = new Map<number, Array<string>>()
  constructor(points: Array<Point>, cellSize: number, walls: Array<Wall>) {
    this.#cellSize = cellSize
    this.#points = points
    this.#walls = walls

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

  get walls() {
    return this.#walls
  }

  addPoint(p: Point) {
    if (this.containsPoint(p) === -1) {
      this.#points.push(p)
      this.updateCells()
      return true
    }
    return false
  }

  removePoint(id: number) {
    for (let i = 0; i < this.#points.length; i++) {
      const p = this.#points[i]
      if (p.identifier === id) {
        this.#points.splice(i, 1)
        this.#pointsCells.delete(i)
        this.updateCells()
        break
      }
    }
  }

  updateCells() {
    // Clear cells to prevent adding points multiple times
    this.clearCells()
    if (ConfigObject && (ConfigObject.generalConfig.useSpacialPartitioning ?? true)) {
      for (let i = 0; i < this.#points.length; i++) {
        const p = this.#points[i]
        const pointIdentifier = p.identifier
        const posCellIndicies = this.#possibleCellIndicies(p)
        for (let j = posCellIndicies.left; j <= posCellIndicies.right; j++) {
          for (let k = posCellIndicies.top; k <= posCellIndicies.bottom; k++) {
            const gridPosition = new Eclipse.Vector2(j * this.#cellSize + this.cellSize * 0.5, k * this.#cellSize + this.cellSize * 0.5)
            const cellPos = new Eclipse.Vector2(j, k)
            // Checks if any part of the point is inside the grid cell
            if (gridPosition.dist(p.position) <= p.radius + this.#cellSize * Math.SQRT1_2) {
              if (this.#pointsCells.has(pointIdentifier)) {
                let existingCells = this.#pointsCells.get(pointIdentifier)
                existingCells?.push(cellPos.toString())
              } else {
                this.#pointsCells.set(pointIdentifier, [cellPos.toString()])
              }
              if (this.#cells.has(cellPos.toString())) {
                let existingPoints = this.#cells.get(cellPos.toString())
                existingPoints?.push(p)
                if (existingPoints) {
                  this.#cells.set(cellPos.toString(), existingPoints)
                }
              } else {
                this.#cells.set(cellPos.toString(), [p])
              }
            }
          }
        }
      }
    } else {
      this.#cells.set(Eclipse.Vector2.ZERO.toString(), this.points)
      for (let i = 0; i < this.points.length; i++) {
        this.#pointsCells.set(this.points[i].identifier, [Eclipse.Vector2.ZERO.toString()])
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
    for (const other of this.points) {
      if (p.identifier !== other.identifier) {
        const totalRadii = p.radius + other.radius
        if (totalRadii >= p.position.dist(other.position)) return true
      }
    }
    return false
  }

  #possibleCellIndicies(p: Point): cellPositions
  #possibleCellIndicies(id: number): cellPositions
  #possibleCellIndicies(point: number | Point) {
    let p: Point
    if (typeof point === 'number') {
      p = this.#points[point]
    } else {
      p = point
    }
    return {
      // Right and bottom would be 1 more than necessary if point is right on the edge.
      // Subtract by 1 to avoid any unecessary checks
      left: Math.floor(p.rect.left / this.#cellSize),
      top: Math.floor(p.rect.top / this.#cellSize),
      right: p.rect.right % this.#cellSize === 0 ? Math.floor(p.rect.right / this.#cellSize) - 0 : Math.floor(p.rect.right / this.#cellSize),
      bottom: p.rect.bottom % this.#cellSize === 0 ? Math.floor(p.rect.bottom / this.#cellSize) - 0 : Math.floor(p.rect.bottom / this.#cellSize),
    }
  }

  /**
   * Returns -1 if the grid does not contain the point specified.
   * Returns the index of the first identical point otherwise.
   */
  containsPoint(p: Point) {
    for (let i = 0; i < this.#points.length; i++) {
      if (this.#points[i].isSameAs(p)) return i
    }
    return -1
  }

  get totalDynamic() {
    let total = 0
    for (let i = 0; i < this.#points.length; i++) {
      if (!this.#points[i].isStatic) total++
    }
    return total
  }

  get totalStatic() {
    let total = 0
    for (let i = 0; i < this.#points.length; i++) {
      if (this.#points[i].isStatic) total++
    }
    return total
  }

  toJSON() {
    return {
      cells: Array.from(this.#cells.entries()).reduce((acc: Record<string, any>, [key, value]) => {
        acc[key] = value.map(point => point.toJSON())
        return acc
      }, {}),
      points: this.#points.map(point => point.toJSON()),
      cellSize: this.#cellSize,
      camX: mainCam.x,
      camY: mainCam.y,
      camZoom: mainCam.zoom,
      pointsCells: Array.from(this.#pointsCells.entries()).reduce((acc: Record<string, any>, [key, value]) => {
        acc[key] = value
        return acc
      }, {}),
      gravity: JSON.stringify(gravity),
      COR: COR,
      walls: this.walls.map(wall => wall.toJSON()),
    }
  }

  fromJSON(jsonString: string) {
    this.clearAllPoints()
    this.#walls = []
    const parsedJSON = JSON.parse(jsonString)
    this.cellSize = parseFloat(parsedJSON.cellSize)
    for (let i = 0; i < parsedJSON.points.length; i++) {
      const p = new Point(Eclipse.Vector2.ZERO, 0, 0, Eclipse.Color.BLACK, false)
      p.fromJSON(JSON.stringify(parsedJSON.points[i]))
      this.addPoint(p)
    }
    for (let i = 0; i < parsedJSON.walls.length; i++) {
      const wall = new Wall(0, 'bottom', Eclipse.Color.BLACK)
      wall.fromJSON(JSON.stringify(parsedJSON.walls[i]))
      this.#walls.push(wall)
    }
    mainCam.x = parseFloat(parsedJSON.camX)
    mainCam.y = parseFloat(parsedJSON.camY)
    mainCam.zoom = parseFloat(parsedJSON.camZoom)
    COR = parsedJSON.COR
    this.updateCells()
    drawScene(this, ctx, mainCam, ConfigObject)
  }
}
