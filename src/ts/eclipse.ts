namespace Eclipse {

  export type Axis = 'x' | 'y'
  export type CSSCursorStyle = 
  | 'auto' 
  | 'default' 
  | 'none' 
  | 'context-menu' 
  | 'help' 
  | 'pointer' 
  | 'progress' 
  | 'wait' 
  | 'cell' 
  | 'crosshair' 
  | 'text' 
  | 'vertical-text' 
  | 'alias' 
  | 'copy' 
  | 'move' 
  | 'no-drop' 
  | 'not-allowed' 
  | 'e-resize' 
  | 'n-resize' 
  | 'ne-resize' 
  | 'nw-resize' 
  | 's-resize' 
  | 'se-resize' 
  | 'sw-resize' 
  | 'w-resize' 
  | 'ew-resize' 
  | 'ns-resize' 
  | 'nesw-resize' 
  | 'nwse-resize' 
  | 'col-resize' 
  | 'row-resize' 
  | 'all-scroll' 
  | 'zoom-in' 
  | 'zoom-out' 
  | 'grab' 
  | 'grabbing'

  // ----- MATH FUNCTIONS AND CLASSES
  export const PI = Math.PI
  export const TAU = PI * 2
  export const HALFPI = PI / 2
  export const QUARTERPI = PI / 4
  export const INF = Number.POSITIVE_INFINITY
  export const NEGINF = Number.NEGATIVE_INFINITY
  export const EPSILON = Number.EPSILON

  // ----- DRAWING FUNCTIONS AND CLASSES
  /**
   * Draws a circular point on a canvas with a specified color and radius.
   * @param {CanvasRenderingContext2D} ctx The context to draw the point on
   * @param {number} x The x position of the point - The top-left corner is 0, 0
   * @param {number} y The y position of the point - The top-left corner is 0, 0
   * @param {number} radius The radius of the point. Defaults to 1
   * @param {Color} color The color of the point. Defaults to black
   */
  export function drawPoint(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: Color): void // Overload 0
  /**
   * Draws a circular point on a canvas with a specified color and radius.
   * @param {CanvasRenderingContext2D} ctx The context to draw the point on
   * @param {Vector2} position The position of the point as a 2d vector
   * @param {Color} color The color of the point. Defaults to black
   * @param {number} radius The radius of the point. Defaults to 1
   */
  export function drawPoint(ctx: CanvasRenderingContext2D, position: Vector2, radius: number, color: Color): void // Overload 1
  /**
   * Draws a circular point on a canvas with a specified color and radius.
   * @param {CanvasRenderingContext2D} ctx The context to draw the point on
   * @param {number[]} position The position of the point as an array. The first value in the array is the x position, the second value is the y position
   * @param {Color} color The color of the point. Defaults to black
   * @param {number} radius The radius of the point. Defaults to 1
   */
  export function drawPoint(ctx: CanvasRenderingContext2D, position: number[], radius: number, color: Color): void // Overload 2
  export function drawPoint(
    ctx: CanvasRenderingContext2D,
    x: number | Vector2 | number[],
    y?: number | Color,
    radius: number | Color = 1,
    color: Color = Color.BLACK
  ) {
    if (typeof x === 'number' && typeof y === 'number' && !(radius instanceof Color)) {
      // Overload 0
      ctx.fillStyle = color.toString()
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, TAU)
      ctx.fill()
    } else if (x instanceof Vector2 && typeof y === 'number') {
      // Overload 1
      ctx.fillStyle = radius.toString()
      ctx.beginPath()
      ctx.arc(x.x, x.y, y, 0, TAU)
      ctx.fill()
    } else if (Array.isArray(x) && typeof y === 'number') {
      // Overload 2
      ctx.fillStyle = color.toString()
      ctx.beginPath()
      ctx.arc(x[0], x[1], y, 0, TAU)
      ctx.fill()
    }
  }

  /**
   * Draws a line between two points on a canvas
   * @param ctx The context of the canvas to draw on
   * @param start The start of the line
   * @param end The end of the line
   * @param weight The thickness of the line. Defaults to 2
   * @param color The color of the line. Defaults to black
   */
  export function drawLine(ctx: CanvasRenderingContext2D, start: Vector2, end: Vector2, weight: number, color: Color): void // Overload 1
  /**
   * Draws a line between two points on a canvas
   * @param {CanvasRenderingContext2D} ctx The context of the canvas to draw on
   * @param {number} x1 The X position of the start of the line
   * @param {number} y1 The Y position of the start of the line
   * @param {number} x2 The X position of the end of the line
   * @param {number} y2 The Y position of the end of the line
   * @param {number} weight The thickness of the line. Defaults to 2
   * @param {Color} color The color of the line. Defaults to black
   */
  export function drawLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, weight: number, color: Color): void // Overload 2
  export function drawLine(
    ctx: CanvasRenderingContext2D,
    x1: number | Vector2,
    y1: number | Vector2,
    x2: number,
    y2: number | Color,
    weight: number = 2,
    color: Color = Color.BLACK
  ): void {
    if (typeof x1 === 'number' && typeof x2 === 'number' && typeof y1 === 'number' && typeof y2 === 'number') {
      // Overload 2
      ctx.lineWidth = weight
      ctx.strokeStyle = color.toString()
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    } else if (x1 instanceof Vector2 && y1 instanceof Vector2) {
      // Overload 1
      ctx.lineWidth = x2
      ctx.strokeStyle = y2.toString()
      ctx.beginPath()
      ctx.moveTo(x1.x, x1.y)
      ctx.lineTo(y1.x, y1.y)
      ctx.stroke()
    }
  }

  export function drawPoly(ctx: CanvasRenderingContext2D, verticies: Array<Eclipse.Vector2>, borderColor: Eclipse.Color, borderWeight: number, fill = false, fillColor = Eclipse.Color.BLACK) {
    if(fill) {
      ctx.moveTo(verticies[0].x, verticies[0].y)
      for(let i = 1; i < verticies.length; i++) {
        ctx.lineTo(verticies[i].x, verticies[i].y)
      }
      ctx.fillStyle = fillColor.toString(); ctx.fill()
    }
    for(let i = 0; i < verticies.length; i++) {
      drawLine(ctx, verticies[i], verticies[i + 1] ?? verticies[0], borderWeight, borderColor)
      if(fill) {
        if(i !== 0) ctx.lineTo(verticies[i].x, verticies[i].y)
      }
    }
  }

  // ----- COLOR FUNCTIONS AND CLASSES
  export class Color {
    r: number = 0
    g: number = 0
    b: number = 0

    /**
     * Creates an rgb color
     * @param {number} r Red value
     * @param {number} g Blue value
     * @param {number} b Green value
     */
    constructor(r: number, g: number, b: number) // Overload 0
    /**
     * Creates an rgb color
     * @param {string} hexOrCSS Can be written as a hex code (must start with '#' like: #ff00ff) or CSS: rgb(255, 0, 255)
     */
    constructor(hexOrCSS: string) // Overload 1
    constructor(r: number | string = 0, g: number = 0, b: number = 0) {
      if (typeof r === 'number') {
        // Overload 0
        this.r = clamp(r, 0, 255)
        this.g = clamp(g, 0, 255)
        this.b = clamp(b, 0, 255)
      } else {
        // Overload 1
        if (r.trim()[0] === '#' && r.trim().length === 7) {
          const hex = r.substring(1, r.length)
          let colors: number[] = new Array(3)
          try {
            colors[0] = clamp(parseInt(hex.substring(0, 2), 16), 0, 255)
            colors[1] = clamp(parseInt(hex.substring(2, 4), 16), 0, 255)
            colors[2] = clamp(parseInt(hex.substring(4, 6), 16), 0, 255)
            this.r = colors[0]
            this.g = colors[1]
            this.b = colors[2]
          } catch {
            throw new Error(`Hex code ${r} could not be parsed to a color.`)
          }
        } else if (new RegExp('rgb\\(\\s*(-?\\d+)\\s*,\\s*(-?\\d+)\\s*,\\s*(-?\\d+)\\s*\\)').test(r) && typeof r === 'string') {
          // Regular expression to test whether or not value is in the format 'rgb(number, number, number)'
          r.toLowerCase()
          const stringVals: string[] = (r.match(new RegExp('rgb\\(\\s*(-?\\d+)\\s*,\\s*(-?\\d+)\\s*,\\s*(-?\\d+)\\s*\\)')) || ['0', '0', '0']).slice(1, 4)
          const parsedVals = new Array(3)
          for (let i = 0; i < 3; i++) {
            parsedVals[i] = parseInt(stringVals[i])
          }
          this.r = clamp(parsedVals[0], 0, 255)
          this.g = clamp(parsedVals[1], 0, 255)
          this.b = clamp(parsedVals[2], 0, 255)
        } else {
          throw new Error(`${r} is not a valid hex code or CSS color.`)
        }
      }
    }

    /**
     * Converts the color to a CSS compatible string: rgb(r, g, b)
     * @returns {string}
     */
    toString(): string {
      return `rgb(${this.r}, ${this.g}, ${this.b})`
    }

    static BLACK = new Color(0, 0, 0)
    static WHITE = new Color(255, 255, 255)
    static LIGHTGREY = new Color(211, 211, 211)
    static DARKGREY = new Color(169, 169, 169)
    static GAINSBORO = new Color(220, 220, 220)
    static LIGHTSLATEGREY = new Color(132, 148, 164)
    static SLATEGRAY = new Color(112, 128, 144)
    static DIMGRAY = new Color(105, 105, 105)
    static RED = new Color(255, 0, 0)
    static GREEN = new Color(0, 255, 0)
    static BLUE = new Color(0, 0, 255)
    static YELLOW = new Color(255, 255, 0)
    static PURPLE = new Color(128, 0, 128)
    static CYAN = new Color(0, 255, 255)
    static MAGENTA = new Color(255, 0, 255)
    static ORANGE = new Color(255, 165, 0)
    static PINK = new Color(255, 192, 203)
    static LAVENDER = new Color(230, 230, 250)
    static INDIGO = new Color(75, 0, 130)
    static TEAL = new Color(0, 128, 128)
    static MAROON = new Color(128, 0, 0)
    static GOLD = new Color(255, 215, 0)
    static SILVER = new Color(192, 192, 192)
    static BROWN = new Color(54, 36, 5)
    static NAVY = new Color(0, 0, 128)
    static OLIVE = new Color(128, 128, 0)
    static TURQUOISE = new Color(64, 224, 208)
    static BEIGE = new Color(245, 245, 220)
    static CORAL = new Color(255, 127, 80)
    static SALMON = new Color(250, 128, 114)
    static PEACH = new Color(255, 218, 185)
    static SKYBLUE = new Color(135, 206, 235)
    static FORESTGREEN = new Color(34, 139, 34)
    static PLUM = new Color(221, 160, 221)
    static KHAKI = new Color(240, 230, 140)
    static STEELBLUE = new Color(70, 130, 180)
    static TAN = new Color(210, 180, 140)
    static DARKORCHID = new Color(153, 50, 204)
    static ROSYBROWN = new Color(188, 143, 143)
    static TOMATO = new Color(255, 99, 71)
    static DARKSLATEGRAY = new Color(47, 79, 79)
    static SLATEBLUE = new Color(106, 90, 205)
    static LEMONCHIFFON = new Color(255, 250, 205)
    static MEDIUMAQUAMARINE = new Color(102, 205, 170)
    static DARKRED = new Color(139, 0, 0)
    static OLIVEDRAB = new Color(107, 142, 35)
    static MIDNIGHTBLUE = new Color(25, 25, 112)
    static SIENNA = new Color(160, 82, 45)
    static CORNFLOWERBLUE = new Color(100, 149, 237)
    static LIGHTSEAGREEN = new Color(32, 178, 170)
    static DARKSALMON = new Color(233, 150, 122)
    static PALEGOLDENROD = new Color(238, 232, 170)
    static LIGHTSLATEGRAY = new Color(119, 136, 153)
    static DARKSEAGREEN = new Color(143, 188, 143)
    static DARKCYAN = new Color(0, 139, 139)
    static DARKORANGE = new Color(255, 140, 0)
    static MEDIUMVIOLETRED = new Color(199, 21, 133)
    static DARKKHAKI = new Color(189, 183, 107)
  }

  // ----- VECTOR FUNCTIONS AND CLASSES

  export class Vector2 {
    x: number = 0
    y: number = 0

    /**
     * Creates a 2D vector with x and y coordinates
     * @param {number} x The X position of the vector
     * @param {number} y The Y position of the vector
     */
    constructor(x: number, y: number)
    /**
     * Creates a 2D vector with x and y coordinates
     * @param arr An array containing 2 numbers. The first number is the X coordinate, the second value is the Y coordinate
     */
    constructor(arr: number[]) // Overload 1
    constructor(x: number | number[] = 0, y: number = 0) {
      if (Array.isArray(x)) {
        this.x = x[0]
        this.y = x[1]
      } else if (typeof y !== 'undefined') {
        this.x = x
        this.y = y
      }
    }

    /**
     * Sets the x and y values of the vector to the x and y values of another vector
     * @param other The vector to set it to
     * @returns {Vector2}
     */
    set(other: Vector2): Vector2 {
      this.x = other.x
      this.y = other.y
      return this
    }

    /**
     * Returns the vector with values added to it
     * @param {number} x The X value or Vector2 to add
     */
    getAdd(x: number | Vector2): Vector2 {
      if (typeof x === 'number') {
        return new Vector2(this.x + x, this.y + x)
      } else {
        return new Vector2(this.x + x.x, this.y + x.y)
      }
    }

    /**
     * Adds to the vector
     * @param {number} x The X value or Vector2 to add
     */
    add(x: number | Vector2): Vector2 {
      if (typeof x === 'number') {
        this.x += x
        this.y += x
      } else {
        this.x += x.x
        this.y += x.y
      }
      return this
    }

    /**
     * Returns the vector with values subtracted from it
     * @param {number} x The X value or Vector2 to subtract by
     */
    getSub(x: number | Vector2): Vector2 {
      if (typeof x === 'number') {
        return new Vector2(this.x - x, this.y - x)
      } else {
        return new Vector2(this.x - x.x, this.y - x.y)
      }
    }

    /**
     * Subtracts from the vector
     * @param {number} x The X value or Vector2 to subtract by
     */
    sub(x: number | Vector2): Vector2 {
      if (typeof x === 'number') {
        this.x -= x
        this.y -= x
      } else {
        this.x -= x.x
        this.y -= x.y
      }
      return this
    }

    /**
     * Returns the vector with values multiplied
     * @param {number} x The X value or Vector2 to multiply by
     */
    getMult(x: number | Vector2): Vector2 {
      if (typeof x === 'number') {
        return new Vector2(this.x * x, this.y * x)
      } else {
        return new Vector2(this.x * x.x, this.y * x.y)
      }
    }

    /**
     * Multiplies the vector
     * @param {number} x The X value or Vector2 to multiply by
     */
    mult(x: number | Vector2): Vector2 {
      if (typeof x === 'number') {
        this.x *= x
        this.y *= x
      } else {
        this.x *= x.x
        this.y *= x.y
      }
      return this
    }

    /**
     * Returns the divided vector
     * @param {number} x The X value or Vector2 to divide by
     */
    getDiv(x: number | Vector2): Vector2 {
      if (typeof x === 'number') {
        if (x === 0) {
          return new Vector2(0, 0)
        }
        return new Vector2(this.x / x, this.y / x)
      } else {
        if (x.x === 0 || x.y === 0) {
          return new Vector2(0, 0)
        }
        return new Vector2(this.x / x.x, this.y / x.y)
      }
    }

    /**
     * Divides the vector
     * @param {number} x The X value or Vector2 to divide by
     */
    div(x: number | Vector2): Vector2 {
      if (typeof x === 'number') {
        if (x === 0) {
          this.x = 0
          this.y = 0
        }
        this.x /= x
        this.y /= x
      } else {
        if (x.x === 0 || x.y === 0) {
          this.x = 0
          this.y = 0
        }
        this.x /= x.x
        this.y /= x.y
      }
      return this
    }

    /**
     * Returns the vector with values raised or lowered to a different power
     * @param {number} x The X value or Vector2 to be the exponent(s)
     */
    getPow(x: number | Vector2): Vector2 {
      if (typeof x === 'number') {
        return new Vector2(Math.pow(this.x, x), Math.pow(this.y, x))
      } else {
        return new Vector2(Math.pow(this.x, x.x), Math.pow(this.y, x.y))
      }
    }

    /**
     * Raises or lowers the vector to a different power
     * @param {number} x The X value or Vector2 to be the exponent(s)
     */
    pow(x: number | Vector2): Vector2 {
      if (typeof x === 'number') {
        this.x ^= x
        this.y ^= x
      } else {
        this.x ^= x.x
        this.y ^= x.y
      }
      return this
    }

    /**
     * Gets the magnitude (length) of the vector
     * @returns {number}
     */
    mag(): number {
      return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
    }

    /**
     * Gets the angle of the vector in radians
     */
    angleRadians(): number {
      return Math.atan2(this.y, this.x)
    }

    /**
     * Gets the angle of the vector in radians
     */
    angleDegrees(): number {
      return radToDeg(Math.atan2(this.y, this.x))
    }

    /**
     * Gets the angle between two vectors in radians
     * @param {Vector2} other
     * @returns {number}
     */
    angleBetweenRadians(other: Vector2): number {
      let thisAngle = this.angleRadians()
      let otherAngle = other.angleRadians()
      return otherAngle - thisAngle
    }

    /**
     * Gets the angle between two vectors in degrees
     * @param {Vector2} other
     * @returns {number}
     */
    angleBetweenDegrees(other: Vector2): number {
      let thisAngle = this.angleDegrees()
      let otherAngle = other.angleDegrees()
      return otherAngle - thisAngle
    }

    /**
     * Get the dot product of two vectors
     * @param {Vector2} other The other vector
     * @returns {number}
     */
    dot(other: Vector2): number {
      return this.mag() * other.mag() * Math.cos(this.angleBetweenRadians(other))
    }

    /**
     * Normalize (set the length to 1) a vector
     * @returns {Vector2}
     */
    normalize(): Vector2 {
      if (this.mag() === 0) {
        this.x = 0
        this.y = 0
      } else {
        this.div(this.mag())
      }
      return this
    }

    /**
     * Gets the normalized (length == 1) vector. Does not change the vector
     * @returns {Vector2}
     */
    getNormalized(): Vector2 {
      if (this.mag() === 0) {
        return new Vector2(0, 0)
      } else {
        return new Vector2(this.x / this.mag(), this.y / this.mag())
      }
    }

    /**
     * Creates and returns a copy of the vector
     */
    copy(): Vector2 {
      return new Vector2(this.x, this.y)
    }

    /**
     * Rotates the vector by a certain angle in radians
     * @param {number} angle The angle in radians to rotate the vector by
     * @param {Vector2} origin The origin vector to rotate around
     * @returns {Vector2}
     */
    rotateRadians(angle: number, origin: Vector2 = new Vector2(0, 0)): Vector2 {
      let newVector = this.copy()
      newVector.sub(origin)
      const mag = newVector.mag()
      const newAngle = newVector.angleRadians() + angle
      newVector.x = Math.cos(newAngle) * mag + origin.x
      newVector.y = Math.sin(newAngle) * mag + origin.y
      this.set(newVector)
      return this
    }

    /**
     * Rotates the vector by a certain angle in degrees
     * @param {number} angle The angle in degrees to rotate the vector by
     * @param {Vector2} origin The origin vector to rotate around
     * @returns {Vector2}
     */
    rotateDegrees(angle: number, origin: Vector2 = new Vector2(0, 0)): Vector2 {
      let newVector = this.copy()
      newVector.sub(origin)
      const mag = newVector.mag()
      const newAngle = newVector.angleDegrees() + angle
      newVector.x = Math.cos(degToRad(newAngle)) * mag + origin.x
      newVector.y = Math.sin(degToRad(newAngle)) * mag + origin.y
      this.set(newVector)
      return this
    }

    /**
     * Gets the rotation of the vector when rotated by an angle in radians
     * @param angle The angle to rotate by in radians
     * @param origin The origin to rotate around
     * @returns {Vector2}
     */
    getRotateRadians(angle: number, origin: Vector2 = new Vector2(0, 0)): Vector2 {
      let newVector = this.copy()
      newVector.sub(origin)
      const mag = newVector.mag()
      const newAngle = newVector.angleRadians() + angle
      newVector.x = Math.cos(newAngle) * mag + origin.x
      newVector.y = Math.sin(newAngle) * mag + origin.y
      return newVector
    }

    /**
     * Gets the rotation of the vector when rotated by an angle in degrees
     * @param angle The angle to rotate by in degrees
     * @param origin The origin to rotate around
     * @returns {Vector2}
     */
    getRotateDegrees(angle: number, origin: Vector2 = new Vector2(0, 0)): Vector2 {
      let newVector = this.copy()
      newVector.sub(origin)
      const mag = newVector.mag()
      const newAngle = newVector.angleDegrees() + angle
      newVector.x = Math.cos(degToRad(newAngle)) * mag + origin.x
      newVector.y = Math.sin(degToRad(newAngle)) * mag + origin.y
      return newVector
    }

    /**
     * Sets the angle of the vector to a specified angle in radians
     * @param angle Angle in radians to set the angle of the vector to
     * @param origin The origin to rotate around
     * @returns {Vector2}
     */
    setAngleRadians(angle: number, origin: Vector2 = new Vector2(0, 0)): Vector2 {
      const newVector = this.copy()
      newVector.sub(origin)
      const mag = newVector.mag()
      newVector.x = Math.cos(angle) * mag + origin.x
      newVector.y = Math.sin(angle) * mag + origin.y
      this.set(newVector)
      return this
    }

    /**
     * Sets the angle of the vector to a specified angle in degrees
     * @param angle Angle in degrees to set the angle of the vector to
     * @param origin The origin to rotate around
     * @returns {Vector2}
     */
    setAngleDegrees(angle: number, origin: Vector2 = new Vector2(0, 0)): Vector2 {
      const newVector = this.copy()
      newVector.sub(origin)
      const mag = newVector.mag()
      newVector.x = Math.cos(degToRad(angle)) * mag + origin.x
      newVector.y = Math.sin(degToRad(angle)) * mag + origin.y
      this.set(newVector)
      return this
    }

    /**
     * Linearly interpolates one vector to another
     * @param other Vector to lerp to
     * @param amt Amount between 0 and 1 to lerp by (0 is the original vector, 1 is other)
     */
    lerp(other: Vector2, amt: number): Vector2 {
      amt = clamp(amt, 0, 1)
      this.add(other.sub(this)).mult(amt)
      return this
    }

    /**
     * Gets a linearly interpolated vector between this and other
     * @param other Vector to lerp to
     * @param amt Amount between 0 and 1 to lerp by (0 is the original vector, 1 is other)
     */
    getLerp(other: Vector2, amt: number): Vector2 {
      let newVector = this.copy()
      amt = clamp(amt, 0, 1)
      newVector.add(other.sub(newVector)).mult(amt)
      return newVector
    }

    /**
     * Checks whether or not two vectors are identical
     * @param other The other vector
     */
    equals(other: Vector2): Boolean {
      if (this.x === other.x && this.y === other.y) {
        return true
      } else {
        return false
      }
    }

    /**
     * Checks whether or not two vectors are approximately equal to each other based on a certain tolerance
     * @param other The other vector
     * @param tolerance The tolerance of the check. The lower the number, the closer the vectors must be to each other
     */
    approxEquals(other: Vector2, tolerance: number = 0.1): Boolean {
      const xDiff = other.x - this.x
      const yDiff = other.y - this.y
      if (xDiff < tolerance && yDiff < tolerance) {
        return true
      } else {
        return false
      }
    }

    /**
     * Gets the distance between two vectors
     * @param other The other vector
     */
    dist(other: Vector2): number {
      return Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2))
    }

    /**
     * Returns the vector formatted as: (x, y)
     */
    toString(): string {
      return `(${this.x}, ${this.y})`
    }

    /**
     * Returns this vector as an array formatted: [x, y]
     */
    toArray(): number[] {
      return [this.x, this.y]
    }

    /**
     * Converts a vector to JSON string
     */
    toJSONString(): string {
      return `{x:${this.x},y:${this.y}}`
    }

    static create(val: number[]): Vector2
    static create(val: string): Vector2
    /**
     * Creates a vector from a value formatted '(x,y)', 'x,y' or an array with it's first two values numbers
     * @param val The value to create the vector from
     */
    static create(val: string | number[]): Vector2 | void {
      if (typeof val === 'string') {
        val = removeChars(val, ['(', ')', ' '])
        if (new RegExp('^-?\\d+,-?\\d+$').test(val)) {
          const coords = val.split(',')
          return new Vector2(parseFloat(coords[0]), parseFloat(coords[1]))
        } else {
          throw new Error('Invalid formatting for Vector2.create() | String input')
        }
      } else if (Array.isArray(val)) {
        if (typeof val[0] !== 'number' || typeof val[1] !== 'number') {
          throw new Error('Invalid formatting for Vector.Vec2.create() | Array input')
        } else {
          return new Vector2(val[0], val[1])
        }
      }
    }

    /**
     * Creates a vector2 with a certain angle (In degrees) and length
     * @param angle The angle of the vector
     * @param length The length/magnitude of the vector
     */
    static fromDegreeAngle(angle: number, length: number = 1): Vector2 {
      const x = parseFloat(Math.cos(degToRad(angle)).toFixed(5)) * length
      const y = parseFloat(Math.sin(degToRad(angle)).toFixed(5)) * length
      return new Vector2(x, y)
    }

    /**
     * Creates a vector2 with a certain angle (In radians) and length
     * @param angle The angle of the vector
     * @param length The length/magnitude of the vector
     */
    static fromRadianAngle(angle: number, length: number = 1): Vector2 {
      const x = parseFloat(Math.cos(angle).toFixed(5)) * length
      const y = parseFloat(Math.sin(angle).toFixed(5)) * length
      return new Vector2(x, y)
    }

    /**
     * Creates a random vector2
     * @param minX Minimum x position
     * @param maxX Maximum x position
     * @param minY Minimum y position
     * @param maxY Maxmimum y position
     */
    static random(minX = -1, maxX = 1, minY = -1, maxY = 1): Vector2 {
      const x = random(minX, maxX)
      const y = random(minY, maxY)
      return new Vector2(x, y)
    }

    static get ZERO() {
      return new Vector2(0, 0)
    }
    static get UP() {
      return new Vector2(0, -1)
    }
    static get DOWN() {
      return new Vector2(0, 1)
    }
    static get LEFT() {
      return new Vector2(-1, 0)
    }
    static get RIGHT() {
      return new Vector2(1, 0)
    }
    static get UPLEFT() {
      return new Vector2(-1, -1)
    }
    static get UPRIGHT() {
      return new Vector2(1, -1)
    }
    static get DOWNLEFT() {
      return new Vector2(-1, 1)
    }
    static get DOWNRIGHT() {
      return new Vector2(1, 1)
    }
  }

  // ------ UTILITY FUNCTIONS
  /**
   * Clamps a value between two numbers
   * @param {number} value The value to clamp
   * @param {number} minimum Minimum number the value can be
   * @param {number} maximum Maximum number the value can be
   * @returns {number}
   */
  export function clamp(value: number, minimum: number, maximum: number): number {
    return Math.max(minimum, Math.min(maximum, value))
  }

  /**
   * Returns a deep copy of the value
   * @param value The value to make a deep copy of
   */
  export function deepCopy(value: any): any {
    return JSON.parse(JSON.stringify(value))
  }

  /**
   * Converts an angle in degrees to radians
   * @param {number} x Angle in degrees to convert to radians
   * @returns {number}
   */
  export function degToRad(x: number): number {
    return (x * PI) / 180
  }

  /**
   * Converts an angle in radians to degrees
   * @param {number} x Angle in radians to convert to degrees
   * @returns {number}
   */
  export function radToDeg(x: number): number {
    return (x * 180) / PI
  }

  /**
   * Removes all characters that match against a regular expression from a string and returns the new string
   * @param str The string to remove characters from
   * @param regex All characters that match against the regular expression are removed
   * @returns
   */
  export function removeChars(str: string, regex: RegExp): string
  /**
   * Removes all characters in array chars from a string and returns the new string
   * @param str The string to remove characters from
   * @param chars The chars to remove
   * @returns
   */
  export function removeChars(str: string, chars: string[]): string
  export function removeChars(str: string, chars: string[] | RegExp): string {
    let ret = ''
    for (let i = 0; i < str.length; i++) {
      if (!(chars instanceof RegExp)) {
        if (!chars.includes(str[i])) {
          ret = ret.concat(str[i])
        }
      } else {
        if (!chars.test(str[i])) {
          ret = ret.concat(str[i])
        }
      }
    }
    return ret
  }

  /**
   * Returns a pseudo-random number between min and max
   * @param min Minimum value for the pseudo-random number
   * @param max Maximum value for the pseudo-random number
   */
  export function random(min = 0, max = 1): number {
    return Math.random() * (max - min + 1) + min
  }

  /**
   * Returns the index of the next instance of a value that matches against a specific regular expression. Returns -1 if there are no such instances.
   * @param arr Array to search
   * @param regex Regular Expression to check against
   * @param index Index to search from
   */
  export function next(arr: any[], regex: RegExp, index: number): number
  export function next(arr: any[], vals: any[], index: number): number
  export function next(arr: any[], vals: any, index: number): number
  /**
   * Returns the index of the next instance of a specific value(s) in an array after a certain index. Returns -1 if there are no more instances of val(s).
   * @param arr Array to search
   * @param val Value to search for
   * @param index Index to search from
   */
  export function next(arr: any[], val: any | any[] | RegExp, index: number): number {
    if (Array.isArray(val)) {
      for (let i = index; i < arr.length; i++) {
        if (val.includes(arr[i])) {
          return i
        }
      }
      return -1
    } else if (val instanceof RegExp) {
      for (let i = index; i < arr.length; i++) {
        if (val.test(arr[i])) {
          return i
        }
      }
      return -1
    } else {
      for (let i = index; i < arr.length; i++) {
        if (val === arr[i]) {
          return i
        }
      }
      return -1
    }
  }

  /**
   * Converts a string to camelCase
   * @param val The string to convert to camelCase
   */
  export function toCamelCase(val: string): string {
    let ret = ''
    for (let i = 0; i < val.length; i++) {
      if (![' ', '_', '\n', '-'].includes(val[i]) || i === val.length - 1) {
        ret = ret.concat(val[i].toLowerCase())
      } else {
        ret = ret.concat(val[next([...val], new RegExp('[^_\\-\\n ]'), i)].toUpperCase())
        i += next([...val], new RegExp('[^_\\-\\n ]'), i) - i
      }
    }
    return ret
  }

  /**
   * Truncates a string to a certain length, and ends it with a suffix.
   * @param val The string to truncate
   * @param max The maximum number of characters that can be in the string
   * @param suffix The suffix to end the string with. These characters do not count towards the maximum. Example: '...'
   */
  export function truncate(val: string, max: number, suffix: string = ''): string {
    return [...val].splice(0, max).join('').concat(suffix)
  }

  /**
   * Returns an array with it's values shuffled
   * @param arr The array to shuffle
   */
  export function shuffle(arr: any[]): any[] {
    let buffer = arr
    let ret = new Array(arr.length)
    for (let i = 0; buffer.length > 0; i++) {
      const rnd = Math.floor(random(0, buffer.length - 1))
      ret[i] = buffer[rnd]
      buffer.splice(rnd, 1)
    }
    return ret
  }

  /**
   * Converts a string to PascalCase
   * @param val The string to convert to PascalCase
   */
  export function toPascalCase(val: string): string {
    let ret = ''
    ret = ret.concat(val[0].toUpperCase())
    for (let i = 1; i < val.length; i++) {
      if (![' ', '_', '\n', '-'].includes(val[i]) || i === val.length - 1) {
        ret = ret.concat(val[i].toLowerCase())
      } else {
        ret = ret.concat(val[next([...val], new RegExp('[^_\\-\\n ]'), i)].toUpperCase())
        i += next([...val], new RegExp('[^_\\-\\n ]'), i) - i
      }
    }
    return ret
  }

  /**
   * Converts a string to snake_case
   * @param val The string to convert to snake_case
   */
  export function toSnakeCase(val: string): string {
    let ret = ''
    for (let i = 0; i < val.length; i++) {
      if (![' ', '_', '\n', '-'].includes(val[i]) || i === val.length - 1) {
        ret = ret.concat(val[i].toLowerCase())
      } else {
        ret = ret.concat('_')
        i += next([...val], new RegExp('[^_\\-\\n ]'), i) - i - 1
      }
    }
    return ret
  }

  /**
   * Converts a string to CONSTANT_CASE
   * @param val The string to convert to CONSTANT_CASE
   */
  export function toConstantCase(val: string): string {
    let ret = ''
    for (let i = 0; i < val.length; i++) {
      if (![' ', '_', '\n', '-'].includes(val[i]) || i === val.length - 1) {
        ret = ret.concat(val[i].toUpperCase())
      } else {
        ret = ret.concat('_')
        i += next([...val], new RegExp('[^_\\-\\n ]'), i) - i - 1
      }
    }
    return ret
  }

  /**
   * Converts a string to kabab-case
   * @param val The string to convert to kebab-case
   */
  export function toKebabCase(val: string): string {
    let ret = ''
    for (let i = 0; i < val.length; i++) {
      if (![' ', '_', '\n', '-'].includes(val[i]) || i === val.length - 1) {
        ret = ret.concat(val[i].toLowerCase())
      } else {
        ret = ret.concat('-')
        i += next([...val], new RegExp('[^_\\-\\n ]'), i) - i - 1
      }
    }
    return ret
  }

  /**
   * Converts a string to Train-Case
   * @param val The string to convert to Train-Case
   */
  export function toTrainCase(val: string): string {
    let ret = ''
    ret = ret.concat(val[0].toUpperCase())
    for (let i = 1; i < val.length; i++) {
      if (![' ', '_', '\n', '-'].includes(val[i]) || i === val.length - 1) {
        ret = ret.concat(val[i].toLowerCase())
      } else {
        ret = ret.concat('-')
        ret = ret.concat(val[next([...val], new RegExp('[^_\\-\\n ]'), i)].toUpperCase())
        i += next([...val], new RegExp('[^_\\-\\n ]'), i) - i
      }
    }
    return ret
  }

  /**
   * Formats the date a specified way. To format the date, use yy, yyyy, mm, or dd. Spaces are optional. The delimiter is put between the days months and years and is / by default.
   * @param date The date object to format into a string
   * @param format The format of the date (yyyymmdd, mmddyy, etc...)
   * @param delimiter The delimiter between days, months, and years
   */
  export function formatDate(date: Date, format: string, delimiter: string = '/'): string {
    format = format.toLowerCase()
    format = removeChars(format, new RegExp('[^y^d^m]'))
    const d = date.getDate()
    const m = date.getMonth()
    const y = date.getFullYear()
    let ret = ''
    let arrFormat = []
    let currentVal = format[0]
    let unusedVals = ['y', 'm', 'd']
    let newVal = ''
    // Put string into array (['yyyy', 'dd', 'mm'])
    for (let i = 0; i < format.length; i++) {
      if (currentVal !== format[i] && unusedVals.includes(format[i])) {
        unusedVals.splice(unusedVals.indexOf(currentVal), 1)
        currentVal = format[i]
        arrFormat.push(newVal)
        newVal = ''
      }
      if (unusedVals.includes(format[i])) {
        newVal = newVal.concat(format[i])
      }
      if (i === format.length - 1) {
        arrFormat.push(newVal)
      }
    }
    // Fix formatting ('yyyyyy' -> 'yyyy')
    for (let i = 0; i < arrFormat.length; i++) {
      switch (arrFormat[i][0]) {
        case 'y':
          if (arrFormat[i].length > 4 || arrFormat[i].length === 3) {
            arrFormat[i] = 'yyyy'
          } else if (arrFormat[i].length < 2) {
            arrFormat[i] = 'yy'
          }
          break
        case 'd':
          arrFormat[i] = 'dd'
          break
        case 'm':
          arrFormat[i] = 'mm'
          break
      }
    }
    // Format date and return
    for (let i = 0; i < arrFormat.length; i++) {
      switch (arrFormat[i][0]) {
        case 'y':
          if (arrFormat[i].length === 4) {
            ret = ret.concat(y.toString())
          } else {
            ret = ret.concat(y.toString().substring(2))
          }
          break
        case 'd':
          ret = ret.concat(d.toString())
          break
        case 'm':
          ret = ret.concat(m.toString())
          break
      }
      if (i !== arrFormat.length - 1) {
        ret = ret.concat(delimiter)
      }
    }
    return ret
  }

  /**
   * Formats a number with a specified delimiter. Eg: 1000000 -> '1,000,000'
   * @param num The number to format
   * @param delimiter The string to put between every third digit. Defaults to ','
   */
  export function formatNumber(num: number, delimiter: string = ','): string {
    let ret = ''
    if (num.toString().indexOf('.') !== -1) {
      var stringNum = cut(num.toString(), '.')
      var decimal: null | string = [...num.toString()].splice(num.toString().indexOf('.')).join('')
    } else {
      var stringNum = num.toString()
      var decimal: null | string = null
    }
    for (let i = stringNum.length - 1; i >= 0; i -= 3) {
      const subStr = range([...stringNum], i - 2, i).join('')
      ret = `${subStr}${ret}`
      ret = `${delimiter}${ret}`
    }
    if (decimal !== null) {
      ret = ret.concat(decimal)
    }
    const result = new RegExp('^,+(.*)').exec(ret)
    if (result !== null) {
      if (result[1] !== null) {
        return result[1]
      } else {
        return result[0]
      }
    }
    return ret
  }

  /**
   * Parses a formatted number (1,000,000.123) to a float
   * @param val The formatted string to parse into a float
   */
  export function fromNumberFormat(val: string): number {
    val = removeChars(val, new RegExp('[\\D].'))
    return parseFloat(val)
  }

  /**
   * Returns a range of an array between a start and endpoint.
   * @param array The array to get the range from
   * @param start The start index of the range
   * @param end The end index of the range
   */
  export function range(array: any[], start: number, end: number): any[] {
    end = clamp(end, 0, array.length - 1)
    start = clamp(start, 0, end)
    let ret = []
    for (let i = start; i <= end; i++) {
      ret.push(array[i])
    }
    return ret
  }

  /**
   * Cuts off everything in a string after the first instance of a specific character.
   * @param str The string to cut
   * @param val Everything after the first instance of this value will be removed
   */
  export function cut(str: string, val: string): string {
    if (str.indexOf(val) === -1) {
      return str
    }
    let ret = ''
    for (let i = 0; i < str.length; i++) {
      if (str[i] === val) {
        break
      }
      ret = ret.concat(str[i])
    }
    return ret
  }

  /**
   * Formats a number as money with 2 decimals and a currency symbol.
   * @param val The number to format as money
   * @param symbol The currency symbol ($ or £, for example)
   * @param symbolAfter Show the currency symbol after the number?
   */
  export function formatMoney(val: number, symbol: string = '$', symbolAfter: boolean = false): string {
    const fixedNum = val.toFixed(2)
    return symbolAfter ? fixedNum.toString().concat(symbol) : symbol.concat(fixedNum.toString())
  }

  /**
   * Checks if a value of type string
   */
  export function isString(val: any): boolean {
    return typeof val === 'string'
  }

  /**
   * Checks if a value of type number
   */
  export function isNumber(val: any): boolean {
    return typeof val === 'number'
  }

  /**
   * Checks if a value of type bigint
   */
  export function isBigInt(val: any): boolean {
    return typeof val === 'bigint'
  }

  /**
   * Checks if a value of type boolean
   */
  export function isBoolean(val: any): boolean {
    return typeof val === 'boolean'
  }

  /**
   * Checks if a value of type function
   */
  export function isFunction(val: any): boolean {
    return typeof val === 'function'
  }

  /**
   * Checks if a value of type object
   */
  export function isObject(val: any): boolean {
    return typeof val === 'object'
  }

  /**
   * Checks if a value of type symbol
   */
  export function isSymbol(val: any): boolean {
    return typeof val === 'symbol'
  }

  /**
   * Checks if a value of type undefined
   */
  export function isUndefined(val: any): boolean {
    return typeof val === 'undefined'
  }

  // ------ INPUT FUNCTIONS AND CLASSES
  export class Mouse {
    readonly x: number = -1
    readonly y: number = -1
    readonly pos: Vector2 = new Vector2(this.x, this.y)
    readonly lmb: boolean = false
    readonly mmb: boolean = false
    readonly rmb: boolean = false

    onmove: Function = () => {}
    onlmbdown: Function = () => {}
    onlmbup: Function = () => {}
    onrmbdown: Function = () => {}
    onrmbup: Function = () => {}
    onmmbdown: Function = () => {}
    onmmbup: Function = () => {}
    onscrolldown: Function = () => {}
    onscrollup: Function = () => {}
    onscroll: Function = () => {}

    constructor(doc: Document) {
      doc.onmousemove = evt => {
        Object.defineProperty(this, 'x', {
          value: evt.clientX,
        })
        Object.defineProperty(this, 'y', {
          value: evt.clientY,
        })
        Object.defineProperty(this, 'pos', {
          value: new Vector2(this.x, this.y),
        })
        this.onmove(evt)
      }
      doc.onmousedown = evt => {
        switch (evt.button) {
          case 0:
            Object.defineProperty(this, 'lmb', {
              value: true,
            })
            this.onlmbdown()
            break
          case 1:
            Object.defineProperty(this, 'mmb', {
              value: true,
            })
            this.onmmbdown()
            break
          case 2:
            Object.defineProperty(this, 'rmb', {
              value: true,
            })
            this.onrmbdown()
            break
        }
      }
      doc.onmouseup = evt => {
        switch (evt.button) {
          case 0:
            Object.defineProperty(this, 'lmb', {
              value: false,
            })
            this.onlmbup()
            break
          case 1:
            Object.defineProperty(this, 'mmb', {
              value: false,
            })
            this.onmmbup()
            break
          case 2:
            Object.defineProperty(this, 'rmb', {
              value: false,
            })
            this.onrmbup()
            break
        }
      }
      doc.onwheel = evt => {
        this.onscroll(evt)
        if (evt.deltaY > 0) {
          this.onscrolldown(evt)
        } else if (evt.deltaY > 0) {
          this.onscrollup(evt)
        }
      }
    }

    /**
     * Returns a vector2 with the position of the mouse relative to an element. The top-left corner of the element is (0, 0). Returns the position of the mouse if the element does not exist
     * @param element The element
     * @returns {Vector2}
     */
    positionRelativeToElement(element: Element): Vector2 {
      if (element) {
        const rect = element.getBoundingClientRect()
        return new Vector2(this.x - rect.left, this.y - rect.top)
      } else {
        throw new Error(`Element ${element} does not exist`)
      }
    }

    /**
     * Checks if the mouse is over a specific element
     * @param element The element to check
     */
    isOverElement(element: Element): boolean {
      const rect = element.getBoundingClientRect()
      if (this.x > rect.left && this.x < rect.right && this.y > rect.top && this.y < rect.bottom) {
        return true
      } else {
        return false
      }
    }

    /**
     * Returns the element that the mouse is hovered over
     */
    hoveredElement(): Element | null {
      return document.elementFromPoint(this.x, this.y)
    }

    /**
     * Hides the mouse cursor when it is on the page
     */
    hide() {
      const body = document.querySelector('body')
      if (body !== null) {
        body.style.cursor = 'none'
      }
    }

    /**
     * Shows the mouse cursor when it is on the page
     */
    show() {
      const body = document.querySelector('body')
      if (body !== null) {
        body.style.cursor = 'default'
      }
    }

    /**
     * Attempts to lock the cursor
     */
    lock() {
      try {
        document.querySelector('body')?.requestPointerLock()
      } catch {
        throw new Error('Page is not in focus. Cannot lock cursor')
      }
    }

    /**
     * Unlocks the cursor if it is locked
     */
    unlock() {
      document.exitPointerLock()
    }
  }

  export type Key =
    | 'KeyA'
    | 'KeyB'
    | 'KeyC'
    | 'KeyD'
    | 'KeyE'
    | 'KeyF'
    | 'KeyG'
    | 'KeyH'
    | 'KeyI'
    | 'KeyJ'
    | 'KeyK'
    | 'KeyL'
    | 'KeyM'
    | 'KeyN'
    | 'KeyO'
    | 'KeyP'
    | 'KeyQ'
    | 'KeyR'
    | 'KeyS'
    | 'KeyT'
    | 'KeyU'
    | 'KeyV'
    | 'KeyW'
    | 'KeyX'
    | 'KeyY'
    | 'KeyZ'
    | 'Digit1'
    | 'Digit2'
    | 'Digit3'
    | 'Digit4'
    | 'Digit5'
    | 'Digit6'
    | 'Digit7'
    | 'Digit8'
    | 'Digit9'
    | 'Digit0'
    | 'Space'
    | 'ArrowUp'
    | 'ArrowDown'
    | 'ArrowLeft'
    | 'ArrowRight'
    | 'Enter'
    | 'Backspace'
    | 'Tab'
    | 'ShiftLeft'
    | 'ControlLeft'
    | 'AltLeft'
    | 'MetaLeft'
    | 'ShiftRight'
    | 'ControlRight'
    | 'AltRight'
    | 'MetaRight'
    | 'Escape'
    | 'F1'
    | 'F2'
    | 'F3'
    | 'F4'
    | 'F5'
    | 'F6'
    | 'F7'
    | 'F8'
    | 'F9'
    | 'F10'
    | 'F11'
    | 'F12'
    | 'PrintScreen'
    | 'ScrollLock'
    | 'Pause'
    | 'Backquote'
    | 'Minus'
    | 'Equal'
    | 'BracketLeft'
    | 'BracketRight'
    | 'Semicolon'
    | 'Quote'
    | 'Backslash'
    | 'Comma'
    | 'Period'
    | 'Slash'
    | 'Insert'
    | 'Delete'
    | 'Home'
    | 'End'
    | 'PageUp'
    | 'PageDown'
    | 'CapsLock'
    | 'ContextMenu'
    | 'Numpad0'
    | 'Numpad1'
    | 'Numpad2'
    | 'Numpad3'
    | 'Numpad4'
    | 'Numpad5'
    | 'Numpad6'
    | 'Numpad7'
    | 'Numpad8'
    | 'Numpad9'
    | 'NumpadMultiply'
    | 'NumpadAdd'
    | 'NumpadSubtract'
    | 'NumpadDecimal'
    | 'NumpadDivide'
    | 'NumpadEnter'
    | 'NumLock'

  export class KeyBoard {
    KeyA: boolean = false
    KeyB: boolean = false
    KeyC: boolean = false
    KeyD: boolean = false
    KeyE: boolean = false
    KeyF: boolean = false
    KeyG: boolean = false
    KeyH: boolean = false
    KeyI: boolean = false
    KeyJ: boolean = false
    KeyK: boolean = false
    KeyL: boolean = false
    KeyM: boolean = false
    KeyN: boolean = false
    KeyO: boolean = false
    KeyP: boolean = false
    KeyQ: boolean = false
    KeyR: boolean = false
    KeyS: boolean = false
    KeyT: boolean = false
    KeyU: boolean = false
    KeyV: boolean = false
    KeyW: boolean = false
    KeyX: boolean = false
    KeyY: boolean = false
    KeyZ: boolean = false
    Digit1: boolean = false
    Digit2: boolean = false
    Digit3: boolean = false
    Digit4: boolean = false
    Digit5: boolean = false
    Digit6: boolean = false
    Digit7: boolean = false
    Digit8: boolean = false
    Digit9: boolean = false
    Digit0: boolean = false
    Space: boolean = false
    ArrowUp: boolean = false
    ArrowDown: boolean = false
    ArrowLeft: boolean = false
    ArrowRight: boolean = false
    Enter: boolean = false
    Backspace: boolean = false
    Tab: boolean = false
    ShiftLeft: boolean = false
    ControlLeft: boolean = false
    AltLeft: boolean = false
    MetaLeft: boolean = false
    ShiftRight: boolean = false
    ControlRight: boolean = false
    AltRight: boolean = false
    MetaRight: boolean = false
    Escape: boolean = false
    F1: boolean = false
    F2: boolean = false
    F3: boolean = false
    F4: boolean = false
    F5: boolean = false
    F6: boolean = false
    F7: boolean = false
    F8: boolean = false
    F9: boolean = false
    F10: boolean = false
    F11: boolean = false
    F12: boolean = false
    PrintScreen: boolean = false
    ScrollLock: boolean = false
    Pause: boolean = false
    Backquote: boolean = false
    Minus: boolean = false
    Equal: boolean = false
    BracketLeft: boolean = false
    BracketRight: boolean = false
    Semicolon: boolean = false
    Quote: boolean = false
    Backslash: boolean = false
    Comma: boolean = false
    Period: boolean = false
    Slash: boolean = false
    Insert: boolean = false
    Delete: boolean = false
    Home: boolean = false
    End: boolean = false
    PageUp: boolean = false
    PageDown: boolean = false
    CapsLock: boolean = false
    ContextMenu: boolean = false
    Numpad0: boolean = false
    Numpad1: boolean = false
    Numpad2: boolean = false
    Numpad3: boolean = false
    Numpad4: boolean = false
    Numpad5: boolean = false
    Numpad6: boolean = false
    Numpad7: boolean = false
    Numpad8: boolean = false
    Numpad9: boolean = false
    NumpadMultiply: boolean = false
    NumpadAdd: boolean = false
    NumpadSubtract: boolean = false
    NumpadDecimal: boolean = false
    NumpadDivide: boolean = false
    NumpadEnter: boolean = false
    NumLock: boolean = false
    #keyCodes: Array<string>

    onkeydown: Function = () => {}
    onkeyup: Function = () => {}
    onshiftdown: Function = () => {}
    onshiftup: Function = () => {}
    onaltup: Function = () => {}
    onaltdown: Function = () => {}
    onctrlup: Function = () => {}
    onctrldown: Function = () => {}

    constructor(doc: Document) {
      doc.onkeydown = evt => {
        Object.defineProperty(this, evt.code, {
          value: true,
        })
        if(evt.code === 'ShiftLeft' || evt.code === 'ShiftRight') this.onshiftdown()
        if(evt.code === 'ControlLeft' || evt.code === 'ControlRight') this.onctrldown()
        if(evt.code === 'AltLeft' || evt.code === 'AltRight') this.onaltdown()
        this.onkeydown(evt.code)
      }
      doc.onkeyup = evt => {
        Object.defineProperty(this, evt.code, {
          value: false,
        })
        if(evt.code === 'ShiftLeft' || evt.code === 'ShiftRight') this.onshiftup()
        if(evt.code === 'ControlLeft' || evt.code === 'ControlRight') this.onctrlup()
        if(evt.code === 'AltLeft' || evt.code === 'AltRight') this.onaltup()
        this.onkeyup(evt.code)
      }
      doc.onblur = () => {
        this.clearKeys()
      }

      this.#keyCodes = [
        'KeyA',
        'KeyB',
        'KeyC',
        'KeyD',
        'KeyE',
        'KeyF',
        'KeyG',
        'KeyH',
        'KeyI',
        'KeyJ',
        'KeyK',
        'KeyL',
        'KeyM',
        'KeyN',
        'KeyO',
        'KeyP',
        'KeyQ',
        'KeyR',
        'KeyS',
        'KeyT',
        'KeyU',
        'KeyV',
        'KeyW',
        'KeyX',
        'KeyY',
        'KeyZ',
        'Digit1',
        'Digit2',
        'Digit3',
        'Digit4',
        'Digit5',
        'Digit6',
        'Digit7',
        'Digit8',
        'Digit9',
        'Digit0',
        'Space',
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'Enter',
        'Backspace',
        'Tab',
        'ShiftLeft',
        'ControlLeft',
        'AltLeft',
        'MetaLeft',
        'ShiftRight',
        'ControlRight',
        'AltRight',
        'MetaRight',
        'Escape',
        'F1',
        'F2',
        'F3',
        'F4',
        'F5',
        'F6',
        'F7',
        'F8',
        'F9',
        'F10',
        'F11',
        'F12',
        'PrintScreen',
        'ScrollLock',
        'Pause',
        'Backquote',
        'Minus',
        'Equal',
        'BracketLeft',
        'BracketRight',
        'Semicolon',
        'Quote',
        'Backslash',
        'Comma',
        'Period',
        'Slash',
        'Insert',
        'Delete',
        'Home',
        'End',
        'PageUp',
        'PageDown',
        'CapsLock',
        'ContextMenu',
        'Numpad0',
        'Numpad1',
        'Numpad2',
        'Numpad3',
        'Numpad4',
        'Numpad5',
        'Numpad6',
        'Numpad7',
        'Numpad8',
        'Numpad9',
        'NumpadMultiply',
        'NumpadAdd',
        'NumpadSubtract',
        'NumpadDecimal',
        'NumpadDivide',
        'NumpadEnter',
        'NumLock'
      ]
    }

    /**
     * Clears all the key inputs
     */
    clearKeys() {
      for (let i = 0; i < this.#keyCodes.length; i++) {
        const key = this.#keyCodes[i]
        Object.defineProperty(this, key, {
          value: false,
        })
      }
    }

    /**
     * Returns true if any shift key is pressed
     */
    get shiftDown(): boolean {
      return this.ShiftLeft || this.ShiftRight
    }

    /**
     * Returns true if any alt key is pressed
     */
    get altDown(): boolean {
      return this.AltLeft || this.AltRight
    }

    /**
     * Returns true if any control key is pressed
     */
    get ctrlDown(): boolean {
      return this.ControlLeft || this.ControlRight
    }

    /**
     * Returns the currently focused element.
     */
    get focused(): Element {
      const focus = document.querySelector(':focus')
      const body = document.querySelector('body')
      if (focus !== null) {
        return focus
      }
      if (body !== null) {
        return body
      }
      return new Element()
    }
  }

  // ------ FILES FUNCTIONS AND CLASSES
  /**
   * Downloads a file from a path
   * @param filePath The path to the file to download
   * @param fileName The name of the file. Must include the extension of the file
   */
  export function downloadFromPath(filePath: string, fileName: string): void {
    const a = document.createElement('a')
    a.href = filePath
    a.download = fileName
    a.click()
  }

  export function downloadTextFile(text: string, name: string): void {
    const a = document.createElement('a')
    a.href = `data:text/plain,${text}`
    a.download = name
    a.click()
  }

  export function downloadCanvas(canvas: HTMLCanvasElement, fileName: string): void
  export function downloadCanvas(ctx: CanvasRenderingContext2D, fileName: string): void
  /**
   * Downloads the contents of a canvas
   * @param canvas The canvas or canvas context to download
   * @param fileName The name of the file. If no extension is provided, the extension will default to png
   */
  // FIXME: jpg not working. jpeg is
  export function downloadCanvas(canvas: CanvasRenderingContext2D | HTMLCanvasElement, fileName: string): void {
    if (canvas instanceof CanvasRenderingContext2D) {
      canvas = canvas.canvas
    }
    const result = new RegExp('.*\\.(.*)').exec(fileName)
    let data
    if (result) {
      if (result[1]) {
        data = canvas.toDataURL(`image/${result[1]}`)
      } else {
        data = canvas.toDataURL()
      }
    }
    const a = document.createElement('a')
    a.download = fileName
    if (data) {
      a.href = data
    }
    a.click()
  }

  // ------ DOM FUNCTIONS AND CLASSES
  export function addElement(element: Element, parent?: Element): void {
    if (!parent) {
      const html = document.querySelector('html')
      if (html) {
        parent = html
      }
    }
    if (!parent) {
      return
    }
    parent.appendChild(element)
  }
}

// ------ DATA STRUCTURES

module.exports = {
  Eclipse: Eclipse,
}
