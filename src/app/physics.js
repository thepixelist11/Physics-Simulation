"use strict";
require('./eclipse');
require('./primitives');
require('./grid');
let gravity = new Eclipse.Vector2(0, 9.81);
let COR = 0.2;
function updatePoints(deltaTime, grid, pxPerM) {
    var _a;
    const points = grid.points;
    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        // Do not update the physics of static points
        if (p.isStatic)
            continue;
        const currentPosition = p.position.copy();
        let newPosition;
        if (p.lastPosition === null) {
            newPosition =
                currentPosition
                    .getAdd(p.initialVelocity.getMult(deltaTime * pxPerM))
                    .getAdd(p.acceleration.getMult(0.5 * deltaTime * deltaTime * pxPerM));
        }
        else {
            newPosition =
                currentPosition.getMult(2)
                    .getSub(p.lastPosition)
                    .getAdd(p.acceleration.getMult(pxPerM * deltaTime * deltaTime));
        }
        if (!(((_a = controller.selectedPoint) === null || _a === void 0 ? void 0 : _a.identifier) === p.identifier && controller.selectionArrowDragged)) {
            p.lastVelocity = p.velocity;
            p.lastPosition = currentPosition.copy();
            p.position = newPosition.copy();
        }
        p.appliedForces = [];
    }
    grid.updateCells();
    handlePointCollisions(grid, deltaTime);
    handleWallCollisions(deltaTime);
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
function handlePointCollisions(grid, deltaTime, checkCount = 32) {
    var _a, _b, _c;
    let pointsHandled = [];
    for (let j = 0; j < checkCount; j++) {
        let pointIndex = 0;
        for (const cells of grid.pointsCells) {
            // Iterates through the points of the cell
            for (let cellIndex = 0; cellIndex < cells[1].length; cellIndex++) {
                let points = grid.cells.get(cells[1][cellIndex]);
                // True if there is another point in the cell
                if (((_a = points === null || points === void 0 ? void 0 : points.length) !== null && _a !== void 0 ? _a : 0) >= 2) {
                    if (points) {
                        const p = grid.points[pointIndex];
                        if (p.identifier === ((_b = controller.selectedPoint) === null || _b === void 0 ? void 0 : _b.identifier) && controller.selectionArrowDragged)
                            continue;
                        for (let pointIndex = 0; pointIndex < points.length; pointIndex++) {
                            const other = points[pointIndex];
                            if (other.identifier === ((_c = controller.selectedPoint) === null || _c === void 0 ? void 0 : _c.identifier) && controller.selectionArrowDragged)
                                continue;
                            if (!(p.isSameAs(other))) {
                                // Check if the points are overlapping
                                const dist = p.position.dist(other.position);
                                const totalRadius = p.radius + other.radius;
                                if (dist < totalRadius) {
                                    const collisionNormal = new Eclipse.Vector2(Math.cos(Math.atan((other.y - p.y) / (other.x - p.x))), Math.sin(Math.atan((other.y - p.y) / (other.x - p.x))));
                                    // Handle change in position for projection collision reaction
                                    let pNewPosition = p.position.copy();
                                    let otherNewPosition = other.position.copy();
                                    const totalMass = p.mass + other.mass;
                                    // Moves the points by half the overlap
                                    const pDisplacement = new Eclipse.Vector2(
                                    // X
                                    (collisionNormal.x *
                                        (p.radius + other.radius - dist)) *
                                        (other.isStatic ? 1 : Math.abs(other.mass / (totalMass || 1))) * (p.x > other.x ? 1 : p.x < other.x ? -1 : 0), 
                                    // Y
                                    (collisionNormal.y *
                                        (p.radius + other.radius - dist)) *
                                        (other.isStatic ? 1 : Math.abs(other.mass / (totalMass || 1))) * (p.x <= other.x ? -1 : 1));
                                    const otherDisplacement = new Eclipse.Vector2(
                                    // X
                                    ((Math.cos(Math.atan((other.y - p.y) / (other.x - p.x)))) *
                                        (p.radius + other.radius - dist)) *
                                        (p.isStatic ? 1 : Math.abs(p.mass / (totalMass || 1))) * (other.x > p.x ? 1 : other.x < p.x ? -1 : 0), 
                                    // Y
                                    ((Math.sin(Math.atan((other.y - p.y) / (other.x - p.x)))) *
                                        (p.radius + other.radius - dist)) *
                                        (p.isStatic ? 1 : Math.abs(p.mass / (totalMass || 1))) * (other.x <= p.x ? -1 : 1));
                                    if (!p.isStatic)
                                        pNewPosition.add(pDisplacement);
                                    if (!other.isStatic && !arrayContainsPoint(pointsHandled, other))
                                        otherNewPosition.sub(otherDisplacement);
                                    p.position = pNewPosition;
                                    other.position = otherNewPosition;
                                    handleWallCollisions(deltaTime);
                                    pointsHandled.push(p, other);
                                }
                            }
                        }
                    }
                }
                grid.updateCells();
            }
            pointIndex++;
        }
    }
}
function handleWallCollisions(deltaTime) {
    var _a;
    for (let i = 0; i < mainGrid.points.length; i++) {
        const p = mainGrid.points[i];
        if (p.isStatic)
            continue;
        if (p.identifier === ((_a = controller.selectedPoint) === null || _a === void 0 ? void 0 : _a.identifier) && controller.selectionArrowDragged)
            continue;
        // Wall collisions
        for (let wallIndex = 0; wallIndex < mainGrid.walls.length; wallIndex++) {
            const w = mainGrid.walls[wallIndex];
            if (checkCollisionWithWall(p, w)) {
                let newVelocity;
                let newPosition = p.position.copy();
                const previousVel = p.velocity.copy();
                switch (w.side) {
                    case "top":
                        newPosition.y += Math.abs(p.y - p.radius - w.position);
                        newVelocity = new Eclipse.Vector2(p.velocity.x, p.velocity.y * -COR);
                        break;
                    case "bottom":
                        newPosition.y -= Math.abs(w.position - p.y - p.radius);
                        newVelocity = new Eclipse.Vector2(p.velocity.x, p.velocity.y * -COR);
                        break;
                    case "left":
                        newPosition.x += Math.abs(p.x - p.radius - w.position);
                        newVelocity = new Eclipse.Vector2(p.velocity.x * -COR, p.velocity.y);
                        break;
                    case "right":
                        newPosition.x -= Math.abs(w.position - p.x - p.radius);
                        newVelocity = new Eclipse.Vector2(p.velocity.x * -COR, p.velocity.y);
                        break;
                }
                p.position = newPosition;
                // The velocity is changed twice so that the last position 
                // relative to the current position remains the same after 
                // the collision so that the final velocity can be accurately 
                // determined
                p.lastVelocity = p.velocity;
                p.velocity = previousVel;
                p.velocity = newVelocity;
                p.onWall = true;
            }
            else {
                p.onWall = false;
            }
        }
    }
}
function arrayContainsPoint(arr, point) {
    for (let i = 0; i < arr.length; i++) {
        if (point.identifier === arr[i].identifier)
            return true;
    }
    return false;
}
function getNewVelocities(p, other, COR = 1) {
    const collisionDist = Math.sqrt((Math.pow((other.x - p.x), 2)) + (Math.pow((other.y - p.y), 2)));
    // Unit normal vector
    const un = new Eclipse.Vector2((other.x - p.x) / collisionDist, (other.y - p.y) / collisionDist);
    // Unit tangent vector
    const ut = new Eclipse.Vector2(-un.y, un.x);
    const utAngle = ut.angleDegrees();
    const v1 = p.velocity;
    const v2 = other.velocity;
    const pRelativeAngle = v1.angleDegrees() - utAngle;
    const otherRelativeAngle = v2.angleDegrees() - utAngle;
    return new Eclipse.Vector2(v1.mag() * (-COR * Math.cos(pRelativeAngle)), v1.mag() * (-COR * Math.sin(pRelativeAngle)));
}
function getCollisionPoint(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const angle = Math.atan2(dy, dx);
    const p1x = p1.x + p1.radius * Math.cos(angle);
    const p1y = p1.y + p1.radius * Math.sin(angle);
    return new Eclipse.Vector2(p1x, p1y);
}
function checkCollisionWithWall(p, w) {
    switch (w.side) {
        case "top":
            return p.y - p.radius < w.position;
        case "bottom":
            return p.y + p.radius > w.position;
        case "left":
            return p.x - p.radius < w.position;
        case "right":
            return p.x + p.radius > w.position;
    }
}
