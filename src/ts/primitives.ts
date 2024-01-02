require('./eclipse')
class Point {
  static idCounter = 0

  // Standard properties
  #position = Eclipse.Vector2.ZERO
  #lastPosition = Eclipse.Vector2.ZERO
  #radius = 5
  #color = Eclipse.Color.BLACK
  #mass = 1
  #isStatic = false
  #identifier
  #appliedForces: Array<Eclipse.Vector2> = []
  #constantAccelerations: Array<Eclipse.Vector2> = [gravity]
  #velocity: Eclipse.Vector2 = Eclipse.Vector2.ZERO

  // Initial properties
  // Standard properties will be set to these on reset
  #initialPosition
  #initialMass
  #initialRadius
  #initialColor
  #initialIsStatic
  #initialVelocity: Eclipse.Vector2
  constructor(position: Eclipse.Vector2, mass: number, radius = 5, color = Eclipse.Color.BLACK, isStatic = false, initialVelocity = Eclipse.Vector2.ZERO) {
    this.position = position
    this.mass = mass
    this.radius = radius
    this.color = color
    this.isStatic = isStatic
    // this.velocity = initialVelocity
    
    this.#initialColor = this.#color
    this.#initialMass = this.#mass
    this.#initialPosition = this.#position
    this.#initialRadius = this.#radius
    this.#initialIsStatic = this.#isStatic
    this.#initialVelocity = initialVelocity

    this.velocity = this.#initialVelocity

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
  // Basic Stormer Method
  // this.position.getSub(this.lastPosition ?? this.position).getDiv(timeStep / 1000).getDiv(pxPerM)
  //
  get velocity() {
    return this.position.getSub(this.lastPosition ?? this.position).getDiv(timeStep / 1000).getDiv(pxPerM)
  }
  get velocityPXPerS() {
    return this.position.getSub(this.lastPosition ?? this.position).getDiv(timeStep / 1000)
  }
  // Changes the last position to change velocity in later calculations
  set velocity(newVel) {
    newVel.mult(pxPerM)
    this.#lastPosition = newVel.getMult(timeStep / 1000).getSub(this.position).getMult(-1)
  }
  set velocityPXPerS(newVel) {
    this.#lastPosition = newVel.getMult(timeStep / 1000).getSub(this.position).getMult(-1)
  }
  get initialVelocity() {
    return this.#initialVelocity.getDiv(pxPerM)
  }
  set initialVelocity(newVel: Eclipse.Vector2) {
    this.#initialVelocity = newVel.getMult(pxPerM)
    this.velocity = newVel
  }
  get initialVelocityPxPerM() {
    return this.initialVelocity
  }
  set initialVelocityPxPerM(newVel: Eclipse.Vector2) {
    this.#initialVelocity = newVel
    this.velocityPXPerS = newVel
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
  get acceleration() {
    let totalForces = Eclipse.Vector2.ZERO
    for(let i = 0; i < this.#appliedForces.length; i++) {
      totalForces.x += this.#appliedForces[i].x
      totalForces.y += this.#appliedForces[i].y
    }
    let totalAcceleration = totalForces.getDiv(this.#mass)
    for(let i = 0; i < this.#constantAccelerations.length; i++) {
      totalAcceleration = totalAcceleration.getAdd(this.#constantAccelerations[i])
    }
    totalAcceleration.mult(0.5)
    return totalAcceleration
  }

  getRelativePosition(other: Point): Eclipse.Vector2 {
    return new Eclipse.Vector2(other.x - this.x, other.y - this.y)
  }

  draw(ctx: CanvasRenderingContext2D) {
    if(ConfigObject.uiConfig.selectedPointOutlineColor && 
      this.identifier === controller.selectedPoint?.identifier &&
      ConfigObject.uiConfig.selectedPointOutlineRadius) {
      Eclipse.drawPoint(
        ctx, 
        this.position, 
        this.radius + ConfigObject.uiConfig.selectedPointOutlineRadius, 
        ConfigObject.uiConfig.selectedPointOutlineColor
      )
    }
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
    this.velocityPXPerS = this.#initialVelocity
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

  toJSON() {
    return {
      position: JSON.stringify(this.#position),
      lastPosition: JSON.stringify(this.#lastPosition),
      radius: this.#radius,
      color: JSON.stringify(this.#color),
      mass: this.#mass,
      isStatic: this.#isStatic,
      identifier: this.#identifier,
      initialPosition: JSON.stringify(this.#initialPosition),
      initialMass: JSON.stringify(this.#initialMass),
      initialColor: JSON.stringify(this.#initialColor),
      initialRadius: this.#initialRadius,
      initialIsStatic: this.#initialIsStatic,
      initialVelocity: JSON.stringify(this.#initialVelocity),
      appliedForces: JSON.stringify(this.#constantAccelerations),
      constantAccelerations: JSON.stringify(this.#constantAccelerations),
    }
  }

  fromJSON(jsonString: string) {
    const parsedJSON = JSON.parse(jsonString)

    const position = JSON.parse(parsedJSON.position)
    this.#position = new Eclipse.Vector2(position.x, position.y)
    const lastPosition = JSON.parse(parsedJSON.lastPosition)
    if(lastPosition && lastPosition.x !== undefined) {
      this.#lastPosition = new Eclipse.Vector2(lastPosition.x, lastPosition.y)
    } else {
      Eclipse.Vector2.ZERO
    }
    this.#radius = parseFloat(parsedJSON.radius)
    const color = JSON.parse(parsedJSON.color)
    this.#color = new Eclipse.Color(color.r, color.g, color.b)
    this.#mass = parseFloat(parsedJSON.mass)
    this.#isStatic = Boolean(parsedJSON.isStatic)
    this.#identifier = parsedJSON.identifier
    const initPosition = JSON.parse(parsedJSON.initialPosition)
    this.#initialPosition = new Eclipse.Vector2(initPosition.x, initPosition.y)
    this.#initialMass = parseFloat(parsedJSON.initialMass)
    const initColor = JSON.parse(parsedJSON.initialColor)
    this.#initialColor = new Eclipse.Color(initColor.r, initColor.g, initColor.b)
    this.#initialRadius = parseFloat(parsedJSON.initialRadius)
    this.#initialIsStatic = Boolean(parsedJSON.initialIsStatic)
    const parsedInitVel = JSON.parse(parsedJSON.initialVelocity)
    this.#initialVelocity = new Eclipse.Vector2(parsedInitVel.x, parsedInitVel.y)
    this.velocityPXPerS = this.#initialVelocity
    
    this.#appliedForces = []
    this.#constantAccelerations = []
    const parsedForcesArray = Array.isArray(parsedJSON.appliedForces) ? [] : JSON.parse(parsedJSON.appliedForces)
    for(let i = 0; i < parsedForcesArray.length; i++) {
      const parsedForces = parsedForcesArray[i]
      this.#constantAccelerations.push(new Eclipse.Vector2(parsedForces.x, parsedForces.y))
    }
    const parsedAccelerationsArray = Array.isArray(parsedJSON.constantAccelerations) ? [] : JSON.parse(parsedJSON.constantAccelerations)
    for(let i = 0; i < parsedAccelerationsArray.length; i++) {
      const parsedAccelerations = parsedAccelerationsArray[i]
      this.#constantAccelerations.push(new Eclipse.Vector2(parsedAccelerations.x, parsedAccelerations.y))
    }
  }

  setNewInitialValues() {
    this.#initialVelocity = this.velocity
    this.#initialColor = this.color
    this.#initialIsStatic = this.isStatic
    this.#initialMass = this.mass
    this.#initialPosition = this.position
    this.#initialRadius = this.radius
  }

  drawMovementArrows(
    arrowSize: number, 
    arrowWidth: number, 
    xColor = Eclipse.Color.GREEN, 
    yColor = Eclipse.Color.BLUE,
    centreColor = Eclipse.Color.YELLOW, 
    xHoveredColor = Eclipse.Color.FORESTGREEN, 
    yHoveredColor = Eclipse.Color.MIDNIGHTBLUE,
    centreHoveredColor = Eclipse.Color.GOLD
  ) {
    const xEnd = this.position.getAdd(Eclipse.Vector2.RIGHT.getMult(this.radius + arrowSize))
    // X Arrow Body
    Eclipse.drawLine(
      ctx, 
      this.position, 
      xEnd,
      arrowWidth, 
      controller.selectionArrowHovered === 'x' ? xHoveredColor : xColor 
    )

    // X Arrow Head
    Eclipse.drawPoly(
      ctx, 
      [
        xEnd,
        new Eclipse.Vector2(xEnd.x - arrowWidth * 2, this.y - arrowWidth * 2),
        new Eclipse.Vector2(xEnd.x - arrowWidth * 2, this.y + arrowWidth * 2),
      ], 
      controller.selectionArrowHovered === 'x' ? xHoveredColor : xColor, 
      1,
      true,
      controller.selectionArrowHovered === 'x' ? xHoveredColor : xColor, 
    )

    const yEnd = this.position.getAdd(Eclipse.Vector2.UP.getMult(this.radius + arrowSize))
    // Y Arrow Body
    Eclipse.drawLine(
      ctx, 
      this.position, 
      yEnd,
      arrowWidth, 
      controller.selectionArrowHovered === 'y' ? yHoveredColor : yColor 
    )

    // Y Arrow Head
    Eclipse.drawPoly(
      ctx, 
      [
        yEnd,
        new Eclipse.Vector2(this.x - arrowWidth * 2, yEnd.y + arrowWidth * 2),
        new Eclipse.Vector2(this.x + arrowWidth * 2, yEnd.y + arrowWidth * 2),
      ], 
      controller.selectionArrowHovered === 'y' ? yHoveredColor : yColor, 
      1,
      true,
      controller.selectionArrowHovered === 'y' ? yHoveredColor : yColor  
    )

    // Centre
    Eclipse.drawPoint(
      ctx, 
      this.position, 
      arrowWidth * 1.5, 
      controller.selectionArrowHovered === 'both' ? centreHoveredColor : centreColor
    )
  }

  callAfterDisplacement(displacement: number, callback: Function) {
    const originalPos = this.position
    const interval = setInterval(() => {
      if(originalPos.dist(this.position) > displacement) {
        clearInterval(interval)
        callback()
      }
    }, 1)
  }
}

type Side = 'top' | 'bottom' | 'left' | 'right'

class Wall {
  #position: number = 0
  #side: Side = 'bottom'
  #color: Eclipse.Color = Eclipse.Color.BLACK

  constructor(position: number, side: Side, color: Eclipse.Color) {
    this.position = position
    this.side = side
    this.color = color
  }

  get position() {
    return this.#position
  }
  set position(newPos) {
    this.#position = newPos
  }

  get side() {
    return this.#side
  }
  set side(newSide) {
    this.#side = newSide
  }

  get color() {
    return this.#color
  }
  set color(newCol) {
    this.#color = newCol
  }

  draw() {
    ctx.fillStyle = this.color.toString()
    switch(this.#side) {
      case "top":
        ctx.fillRect(0, (this.position * mainCam.zoom) - mainCam.y, canvas.width, -canvas.height)
        break
      case "bottom":
        ctx.fillRect(0, (this.position * mainCam.zoom) - mainCam.y, canvas.width, canvas.height)
        break
      case "left":
        ctx.fillRect((this.position * mainCam.zoom) - mainCam.x, 0, -canvas.width, canvas.height)
        break
      case "right":
        ctx.fillRect((this.position * mainCam.zoom) - mainCam.x, 0, canvas.width, canvas.height)
        break
    }
  }
}

