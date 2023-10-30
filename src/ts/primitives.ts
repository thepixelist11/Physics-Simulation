import * as Eclipse from './eclipse.ts'
export class Point {
  #_position = Eclipse.Vector2.ZERO
  #_radius = 5
  #_color = Eclipse.Color.BLACK
  #_mass = 1
  #_lastPosition = Eclipse.Vector2.ZERO
  #_initialPosition
  #_initialMass
  #_initialRadius
  #_initialColor
  constructor(position: Eclipse.Vector2, mass: number, radius = 5, color = Eclipse.Color.BLACK) {
    this.position = position
    this.mass = mass
    this.radius = radius
    this.color = color
    this.lastPosition = this.position
    this.#_initialColor = this.#_color
    this.#_initialMass = this.#_mass
    this.#_initialPosition = this.#_position
    this.#_initialRadius = this.#_radius
  }
  get position() {
    return this.#_position
  }
  set position(pos) {
    if (pos instanceof Eclipse.Vector2) {
      this.#_position = pos
    } else {
      throw new Error(`pos (${pos}) is not of type Vector2`)
    }
  }
  get x() {
    return this.#_position.x
  }
  set x(x) {
    if(typeof x === 'number'){
      this.#_position = new Eclipse.Vector2(x, this.#_position.x)
    } else {
      throw new Error(`x (${x}) is not of type number`)
    }
  }
  get y() {
    return this.#_position.y
  }
  set y(y) {
    if(typeof y === 'number'){
      this.#_position = new Eclipse.Vector2(this.#_position.y, y)
    } else {
      throw new Error(`y (${y}) is not of type number`)
    }
  }
  get radius() {
    return this.#_radius
  }
  set radius(rad) {
    if (typeof rad === 'number') {
      this.#_radius = Eclipse.clamp(rad, 0, Eclipse.INF)
    } else {
      throw new Error(`rad (${rad}) is not of type number`)
    }
  }
  get color() {
    return this.#_color
  }
  set color(col) {
    if (col instanceof Eclipse.Color) {
      this.#_color = col
    } else {
      throw new Error(`col (${col}) is not of type Color`)
    }
  }
  get mass() {
    return this.#_mass
  }
  set mass(mass) {
    if(typeof mass === 'number'){
      this.#_mass = Eclipse.clamp(mass, 0, Eclipse.INF)
    } else {
      throw new Error(`Mass (${mass}) is not of type number`)
    }
  }
  get lastPosition() {
    return this.#_lastPosition
  }
  set lastPosition(newLastPosition) {
    if(newLastPosition instanceof Eclipse.Vector2) {
      this.#_lastPosition = newLastPosition
    } else {
      throw new Error(`newLastPosition (${newLastPosition}) is not an instance of Vector2`)
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    Eclipse.drawPoint(ctx, this.position, this.color, this.radius)
  }

  reset() {
    this.position = this.#_initialPosition
    this.lastPosition = this.#_position
    this.mass = this.#_initialMass
    this.color = this.#_initialColor
    this.radius = this.#_initialRadius
  }
}
