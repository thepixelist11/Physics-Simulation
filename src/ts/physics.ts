require('./eclipse')
require('./primitives')
require('./grid')

let gravity = new Eclipse.Vector2(0, 9.81)

function updatePoints(deltaTime: number, grid: Grid, pxPerM: number) {
  const points = grid.points
  for (let i = 0; i < points.length; i++) {
    const p = points[i]

    // Do not update the physics of static points
    if(p.isStatic) continue

    const currentPosition = p.position.copy()
    let newPosition: Eclipse.Vector2
    if(p.lastPosition === null) {
      newPosition = 
        currentPosition
        .getAdd(p.initialVelocity.getMult(deltaTime * pxPerM))
        .getAdd(p.acceleration.getMult(0.5 * deltaTime * deltaTime * pxPerM))
    } else {
      newPosition =  
        currentPosition.getMult(2)
        .getSub(p.lastPosition)
        .getAdd(p.acceleration.getMult(pxPerM * deltaTime * deltaTime))
    }

    if(!(controller.selectedPoint?.identifier === p.identifier && controller.selectionArrowDragged)) {
      p.lastPosition = currentPosition.copy()
      p.position = newPosition.copy()
    }
  }
  grid.updateCells()
  handlePointCollisions(grid)
  handleWallCollisions()
}
  // VELOCITY VERLET (More precise and performant, collision doesn't work.)
  // const currentVelocity = p.velocity.copy()
  // // P(t+1) = p(t) + v(t)∆t + 0.5 * a(t) * ∆t^2
  // let newPosition: Eclipse.Vector2
  // newPosition = currentPosition.getAdd(
  //   currentVelocity.getMult(deltaTime)
  // )
  // .add(p.acceleration.getMult(deltaTime * deltaTime * pxPerM * 0.5))

  // // V(t+1) = v(t) + 0.5 * (a(t) + (t+1))∆t
  // let newVelocity: Eclipse.Vector2
  // newVelocity = currentVelocity.getDiv(pxPerM).getAdd(
  //   p.acceleration.getMult(0.5 * deltaTime)
  // )
  // p.velocity = newVelocity.copy().getMult(pxPerM)
  

function handlePointCollisions(grid: Grid, checkCount = 16) {
  let pointsHandled = []
  for(let j = 0; j < checkCount; j++) {
    let pointIndex = 0
    for(const cells of grid.pointsCells) {
      // Iterates through the points of the cell
      for(let cellIndex = 0; cellIndex < cells[1].length; cellIndex++) {
        let points = grid.cells.get(cells[1][cellIndex])
        // True if there is another point in the cell
        if((points?.length ?? 0) >= 2) {
          if(points) {
            const p = grid.points[pointIndex]
            if(p.identifier === controller.selectedPoint?.identifier && controller.selectionArrowDragged) continue
            for(let pointIndex = 0; pointIndex < points.length; pointIndex++) {
              const other = points[pointIndex]
              if(other.identifier === controller.selectedPoint?.identifier && controller.selectionArrowDragged) continue
              if(!(p.isSameAs(other))) {
                // Check if the points are overlapping
                const dist = p.position.dist(other.position)
                const totalRadius = p.radius + other.radius
                if(dist < totalRadius) {
                  const collisionNormal = new Eclipse.Vector2(
                    Math.cos(Math.atan((other.y - p.y) / (other.x - p.x))),
                    Math.sin(Math.atan((other.y - p.y) / (other.x - p.x))),
                  )

                  // Handle change in position for projection collision reaction
                  let pNewPosition = p.position.copy()
                  let otherNewPosition = other.position.copy()
                  // Moves the points by half the overlap
                  const pDisplacement = new Eclipse.Vector2(
                    // X
                    (collisionNormal.x *
                    (p.radius + other.radius - dist)) *
                    (other.isStatic ? 1 : 0.5) * (p.x > other.x ? 1 : p.x < other.x ? -1 : 0),
                    // Y
                    (collisionNormal.y *
                    (p.radius + other.radius - dist)) *
                    (other.isStatic ? 1 : 0.5) * (p.x <= other.x ? -1 : 1)
                  )
                  const otherDisplacement = new Eclipse.Vector2(
                    // X
                    ((Math.cos(Math.atan((other.y - p.y) / (other.x - p.x)))) *
                    (p.radius + other.radius - dist)) *
                    (p.isStatic ? 1 : 0.5) * (other.x > p.x ? 1 : other.x < p.x ? -1 : 0),
                    // Y
                    ((Math.sin(Math.atan((other.y - p.y) / (other.x - p.x)))) *
                    (p.radius + other.radius - dist)) *
                    (p.isStatic ? 1 : 0.5) * (other.x <= p.x ? -1 : 1)
                  )
                  
                  if(!p.isStatic) pNewPosition.add(pDisplacement)
                  if(!other.isStatic && !arrayContainsPoint(pointsHandled, other)) otherNewPosition.sub(otherDisplacement)
                  
                  p.position = pNewPosition
                  other.position = otherNewPosition

                  // This code will enable impulse-based collisions for all points. This does not currently work properly
                  // Currently points can only collide with flat wall primitives with impulse-based collisions.

                  // Coefficient of restitution
                  // const e = 1
                  
                  // const newVelocities = getNewVelocities(p, other)
                  // p.velocity = newVelocities.pVel.copy()
                  // other.velocity = newVelocities.otherVel.copy()

                  pointsHandled.push(p, other)
                }
              }
            }
          }
        }
        grid.updateCells()
      }
      pointIndex++
    }
  }
}

function handleWallCollisions() {
  for(let i = 0; i < mainGrid.points.length; i++) {
    const p = mainGrid.points[i]
    if(p.isStatic) continue
    if(p.identifier === controller.selectedPoint?.identifier && controller.selectionArrowDragged) continue
    // Wall collisions
    for(let wallIndex = 0; wallIndex < mainGrid.walls.length; wallIndex++) {
      const w = mainGrid.walls[wallIndex]
      const COR = 0.7
      if(checkCollisionWithWall(p, w)) {
        let newVelocity: Eclipse.Vector2
        let newPosition = p.position.copy()
        const previousVel = p.velocity.copy()
        switch(w.side) {
          case "top":
            newPosition.y += Math.abs(p.y - p.radius - w.position)
            newVelocity = new Eclipse.Vector2(p.velocity.x, p.velocity.y * -COR)
            break
          case "bottom":
            newPosition.y -= Math.abs(w.position - p.y - p.radius)
            newVelocity = new Eclipse.Vector2(p.velocity.x, p.velocity.y * -COR)
            break
          case "left":
            newPosition.x += Math.abs(p.x - p.radius - w.position)
            newVelocity = new Eclipse.Vector2(p.velocity.x * -COR, p.velocity.y)
            break
          case "right":
            newPosition.x -= Math.abs(p.x - p.radius - w.position)
            newVelocity = new Eclipse.Vector2(p.velocity.x * -COR, p.velocity.y)
            break
        }
        p.position = newPosition
        // The velocity is changed twice so that the last position 
        // relative to the current position remains the same after 
        // the collision so that the final velocity can be accurately 
        // determined
        p.velocity = previousVel 
        p.velocity = newVelocity
      }
    }
  }
}

function arrayContainsPoint(arr: Array<Point>, point: Point) {
  for(let i = 0; i < arr.length; i++) {
    if(point.identifier === arr[i].identifier) return true
  }
  return false
}

function getNewVelocities(p: Point, other: Point, COR = 1): {pVel: Eclipse.Vector2, otherVel: Eclipse.Vector2} {
  const collisionDist = Math.sqrt(((other.x - p.x) ** 2) + ((other.y - p.y) ** 2))

  // Unit normal vector
  const un = new Eclipse.Vector2((other.x - p.x) / collisionDist, (other.y - p.y) / collisionDist)
  // const un = new Eclipse.Vector2(other.x - collisionPoint.x, other.y - collisionPoint.y).getNormalized()
  
  // Unit tangent vector
  const ut = new Eclipse.Vector2(-un.y, un.x)
   
  const v1 = p.velocity
  const v2 = other.velocity
  const totalMass = p.mass + other.mass
  if(other.isStatic) {
    const k = 2 * v1.dot(un) / totalMass
    const v1Prime = new Eclipse.Vector2(
      v1.x - k * p.mass * un.x - k * other.mass * un.x,
      v1.y - k * p.mass * un.y - k * other.mass * un.y,
    )
    return {pVel: v1Prime.getMult(-1), otherVel: Eclipse.Vector2.ZERO}
  } else if (p.isStatic){
    return {pVel: Eclipse.Vector2.ZERO, otherVel: Eclipse.Vector2.ZERO}
  } else {
    // V1 projected (normal)
    const v1n = un.dot(v1)
    // V2 projected (normal)
    const v2n = un.dot(v2)
    // V1 projected (tangent)
    const v1t = ut.dot(v1)
    // V2 projected (tangent)
    const v2t = ut.dot(v2)
    
    // 1d collision equations
    const v1nPrime = (v1n * (p.mass - other.mass) + (2 * other.mass * v2n)) / totalMass
    const v2nPrime = (v2n * (other.mass - p.mass) + (2 * p.mass * v1n)) / totalMass
    
    const vectorV1n = un.getMult(v1nPrime)
    const vectorV1t = ut.getMult(v1t)
    const vectorV2n = un.getMult(v2nPrime)
    const vectorV2t = ut.getMult(v2t)
    
    return {pVel: vectorV1n.getAdd(vectorV1t), otherVel: vectorV2n.getAdd(vectorV2t)}
  }
}

function getCollisionPoint(p1: Point, p2: Point): Eclipse.Vector2 {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y

  const angle = Math.atan2(dy, dx)

  const p1x = p1.x + p1.radius * Math.cos(angle)
  const p1y = p1.y + p1.radius * Math.sin(angle)

  return new Eclipse.Vector2(p1x, p1y)
}

function checkCollisionWithWall(p: Point, w: Wall) {
  switch(w.side) {
    case "top":
      return p.y - p.radius < w.position
    case "bottom":
      return p.y + p.radius > w.position
    case "left":
      return p.x - p.radius < w.position
    case "right":
      return p.x + p.radius > w.position
  }
}