///<reference path="./eclipse.js"/>
///<reference path="./primitives.js"/>

const gravity = 9.81

/**
 * Updates all specified points with a certain time step (deltaTime)
 * @param {number} deltaTime Time step
 * @param {object} object The object containing the points to update. points: individual points,
 */
function physicsUpdate(deltaTime, object) {
  for (const objName in object) {
    const obj = object[objName]
    switch (objName) {
      case 'points':
        updatePoints(deltaTime, obj)
        break
    }
  }
}

function updatePoints(deltaTime, points) {
  for (let i = 0; i < points.length; i++) {
    const p = points[i]
    const currentPosition = p.position.copy()
    const newPosition = currentPosition
      .getMult(2)
      .getSub(p.lastPosition)
      .getAdd(Vector2.DOWN.getMult(gravity).getMult(Math.pow(deltaTime, 2)))
    p.lastPosition = currentPosition.copy()
    p.position = newPosition.copy()
  }
}
