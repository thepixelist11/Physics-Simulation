require('./eclipse')
class Point {
  static idCounter = 0

  // Standard properties
  #position = Eclipse.Vector2.ZERO
  #lastPosition: null | Eclipse.Vector2 = null
  #radius = 5
  #color = Eclipse.Color.BLACK
  #mass = 1
  #isStatic = false
  #identifier

  // Initial properties
  // Standard properties will be set to these on reset
  #initialPosition
  #initialMass
  #initialRadius
  #initialColor
  #initialIsStatic
  constructor(position: Eclipse.Vector2, mass: number, radius = 5, color = Eclipse.Color.BLACK, isStatic = false) {
    this.position = position
    this.mass = mass
    this.radius = radius
    this.color = color
    this.lastPosition = position
    this.isStatic = isStatic

    this.#initialColor = this.#color
    this.#initialMass = this.#mass
    this.#initialPosition = this.#position
    this.#initialRadius = this.#radius
    this.#initialIsStatic = this.#isStatic

    this.#identifier = Point.idCounter++
  }
  get position() {
    return this.#position
  }
  set position(pos) {
    if (pos instanceof Eclipse.Vector2) {
      this.#position = pos
    } else {
      throw new Error(`pos (${pos}) is not of type Vector2`)
    }
  }
  get x() {
    return this.#position.x
  }
  set x(x) {
    if (typeof x === 'number') {
      this.#position = new Eclipse.Vector2(x, this.#position.y)
    } else {
      throw new Error(`x (${x}) is not of type number`)
    }
  }
  get y() {
    return this.#position.y
  }
  set y(y) {
    if (typeof y === 'number') {
      this.#position = new Eclipse.Vector2(this.#position.x, y)
    } else {
      throw new Error(`y (${y}) is not of type number`)
    }
  }
  get radius() {
    return this.#radius
  }
  set radius(rad) {
    if (typeof rad === 'number') {
      this.#radius = Eclipse.clamp(rad, 0, Eclipse.INF)
    } else {
      throw new Error(`rad (${rad}) is not of type number`)
    }
  }
  get color() {
    return this.#color
  }
  set color(col) {
    if (col instanceof Eclipse.Color) {
      this.#color = col
    } else {
      throw new Error(`col (${col}) is not of type Color`)
    }
  }
  get mass() {
    return this.#mass
  }
  set mass(mass) {
    if (typeof mass === 'number') {
      this.#mass = Eclipse.clamp(mass, 0, Eclipse.INF)
    } else {
      throw new Error(`Mass (${mass}) is not of type number`)
    }
  }
  get lastPosition() {
    return this.#lastPosition
  }
  set lastPosition(newLastPosition) {
    this.#lastPosition = newLastPosition
  }
  get isStatic() {
    return this.#isStatic
  }
  set isStatic(isStatic: boolean) {
    this.#isStatic = isStatic
  }
  get velocity() {
    return this.#position.getSub(this.#lastPosition ?? Eclipse.Vector2.ZERO)
  }
  get identifier() {
    return this.#identifier
  }

  get rect() {
    return {
      left: this.x - this.radius,
      right: this.x + this.radius,
      top: this.y - this.radius,
      bottom: this.y + this.radius,
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    Eclipse.drawPoint(ctx, this.position, this.radius, this.color)
  }

  // Sets the standard properties to the initial properties, resetting the point
  reset() {
    this.position = this.#initialPosition
    this.lastPosition = this.position
    this.mass = this.#initialMass
    this.color = this.#initialColor
    this.radius = this.#initialRadius
    this.#isStatic = this.#initialIsStatic
  }

  isSameAs(other: Point) {
    if(
      this.x === other.x &&
      this.y === other.y &&
      this.radius === other.radius &&
      this.mass === other.mass
    ) return true 
    else return false
  }
}

module.exports = {
  Point: Point,
}
