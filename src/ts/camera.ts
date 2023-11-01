require('./eclipse')
require('./drawing')

class Camera {
  #_pos = Eclipse.Vector2.ZERO
  #_zoom = 1
  constructor(pos: Eclipse.Vector2, zoom: number) {
    this.pos = pos
    this.zoom = zoom
  }

  get pos() {
    return this.#_pos
  }
  set pos(newPos: Eclipse.Vector2) {
    this.#_pos = newPos
  }

  get x() {
    return this.#_pos.x
  }
  set x(newX: number) {
    this.#_pos.x = newX
  }

  get y() {
    return this.#_pos.y
  }
  set y(newY: number) {
    this.#_pos.y = newY
  }

  get zoom() {
    this.#_zoom = Eclipse.clamp(this.#_zoom, 0.01, Eclipse.INF)
    return this.#_zoom
  }
  set zoom(newZoom: number) {
    this.#_zoom = Eclipse.clamp(newZoom, 0.01, Eclipse.INF)
  }

  translate(x: Eclipse.Vector2): void
  translate(x: number, y: number): void
  translate(x: number | Eclipse.Vector2, y?: number) {
    if(x instanceof Eclipse.Vector2) {
      this.#_pos.add(x)
    } else if(y) {
      this.#_pos.add(new Eclipse.Vector2(x, y))
    }
  }
}

module.exports = {
  Camera: Camera,
}
