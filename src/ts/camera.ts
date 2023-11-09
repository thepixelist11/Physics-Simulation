require('./eclipse')
require('./drawing')

class Camera {
  #pos = Eclipse.Vector2.ZERO
  #zoom = 1
  constructor(pos: Eclipse.Vector2, zoom: number) {
    this.pos = pos
    this.zoom = zoom
  }

  get pos() {
    return this.#pos
  }
  set pos(newPos: Eclipse.Vector2) {
    this.#pos = newPos
  }

  get x() {
    return this.#pos.x
  }
  set x(newX: number) {
    this.#pos.x = newX
  }

  get y() {
    return this.#pos.y
  }
  set y(newY: number) {
    this.#pos.y = newY
  }

  get zoom() {
    this.#zoom = Eclipse.clamp(this.#zoom, 0.01, Eclipse.INF)
    return this.#zoom
  }
  set zoom(newZoom: number) {
    this.#zoom = Eclipse.clamp(newZoom, 0.01, Eclipse.INF)
  }

  translate(x: Eclipse.Vector2): void
  translate(x: number, y: number): void
  translate(x: number | Eclipse.Vector2, y?: number) {
    if(x instanceof Eclipse.Vector2) {
      this.#pos.add(x)
    } else if(y) {
      this.#pos.add(new Eclipse.Vector2(x, y))
    }
  }
}

module.exports = {
  Camera: Camera,
}
