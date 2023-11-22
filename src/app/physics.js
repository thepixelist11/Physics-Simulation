"use strict";
require('./eclipse');
require('./primitives');
require('./grid');
const gravity = new Eclipse.Vector2(0, 9.81);
function updatePoints(deltaTime, grid, pxPerM) {
    const points = grid.points;
    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        // Do not update the physics of static points
        if (p.isStatic)
            continue;
        const currentPosition = p.position.copy();
        // x[t+1] = 2x[t]-x[t-1] + a[t]∆t^2
        const newPosition = currentPosition
            .getMult(2)
            //@ts-ignore
            .getSub(p.lastPosition)
            .getAdd(gravity.getMult(pxPerM)
            .getMult(Math.pow(deltaTime, 2)));
        p.lastPosition = currentPosition.copy();
        p.position = newPosition.copy();
    }
    grid.updateCells();
    handleCollisions(grid);
}
function handleCollisions(grid, checkCount = 1) {
    var _a;
    let pointsHandled = [];
    for (let j = 0; j < checkCount; j++) {
        let pointIndex = 0;
        for (const cells of grid.pointsCells) {
            // Iterates through the points of the cell
            for (let i = 0; i < cells[1].length; i++) {
                let points = grid.cells.get(cells[1][i]);
                // True if there is another point in the cell
                if (((_a = points === null || points === void 0 ? void 0 : points.length) !== null && _a !== void 0 ? _a : 0) >= 2) {
                    if (points) {
                        const p = grid.points[pointIndex];
                        for (let i = 0; i < points.length; i++) {
                            const other = points[i];
                            if (!(p.isSameAs(other))) {
                                // Check if the points are overlapping
                                const dist = p.position.dist(other.position);
                                const totalMass = p.mass + other.mass;
                                const totalRadius = p.radius + other.radius;
                                if (dist < totalRadius) {
                                    let pNewPosition = p.position.copy();
                                    let otherNewPosition = other.position.copy();
                                    // Moves the points by half the overlap
                                    const pDisplacement = new Eclipse.Vector2(
                                    // X
                                    ((Math.cos(Math.atan((other.y - p.y) / (other.x - p.x)))) *
                                        (p.radius + other.radius - Math.sqrt((Math.pow((other.x - p.x), 2)) + (Math.pow((other.y - p.y), 2))))) /
                                        (other.isStatic ? 1 : 2) * (p.x >= other.x ? 1 : -1), 
                                    // Y
                                    ((Math.sin(Math.atan((other.y - p.y) / (other.x - p.x)))) *
                                        (p.radius + other.radius - Math.sqrt((Math.pow((other.x - p.x), 2)) + (Math.pow((other.y - p.y), 2))))) /
                                        (other.isStatic ? 1 : 2) * (p.x >= other.x ? 1 : -1));
                                    const otherDisplacement = new Eclipse.Vector2(
                                    // X
                                    ((Math.cos(Math.atan((other.y - p.y) / (other.x - p.x)))) *
                                        (p.radius + other.radius - Math.sqrt((Math.pow((other.x - p.x), 2)) + (Math.pow((other.y - p.y), 2))))) /
                                        (p.isStatic ? 1 : 2) * (other.x <= p.x ? 1 : -1), 
                                    // Y
                                    ((Math.sin(Math.atan((other.y - p.y) / (other.x - p.x)))) *
                                        (p.radius + other.radius - Math.sqrt((Math.pow((other.x - p.x), 2)) + (Math.pow((other.y - p.y), 2))))) /
                                        (p.isStatic ? 1 : 2) * (other.x <= p.x ? 1 : -1));
                                    if (!p.isStatic && !arrayContainsPoint(pointsHandled, p))
                                        pNewPosition.add(pDisplacement);
                                    if (!other.isStatic && !arrayContainsPoint(pointsHandled, other))
                                        otherNewPosition.sub(otherDisplacement);
                                    p.position = pNewPosition;
                                    other.position = otherNewPosition;
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
function arrayContainsPoint(arr, point) {
    for (let i = 0; i < arr.length; i++) {
        if (point.identifier === arr[i].identifier)
            return true;
    }
    return false;
}
module.exports = {
    gravity: gravity,
    updatePoints: updatePoints
};
