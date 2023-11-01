require('./eclipse')

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
}

module.exports = {
  Camera: Camera,
}
