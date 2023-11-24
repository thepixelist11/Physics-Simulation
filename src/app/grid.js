"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Grid_instances, _Grid_cells, _Grid_points, _Grid_cellSize, _Grid_pointsCells, _Grid_possibleCellIndicies;
require('./eclipse');
require('./primitives');
class Grid {
    constructor(points, cellSize) {
        _Grid_instances.add(this);
        _Grid_cells.set(this, new Map());
        _Grid_points.set(this, Array());
        _Grid_cellSize.set(this, void 0);
        // The cells that every point is in
        _Grid_pointsCells.set(this, new Map());
        __classPrivateFieldSet(this, _Grid_cellSize, cellSize, "f");
        __classPrivateFieldSet(this, _Grid_points, points, "f");
        this.updateCells();
    }
    get points() {
        return __classPrivateFieldGet(this, _Grid_points, "f");
    }
    get cells() {
        return __classPrivateFieldGet(this, _Grid_cells, "f");
    }
    get cellSize() {
        return __classPrivateFieldGet(this, _Grid_cellSize, "f");
    }
    set cellSize(newCellSize) {
        __classPrivateFieldSet(this, _Grid_cellSize, newCellSize, "f");
    }
    get pointsCells() {
        return __classPrivateFieldGet(this, _Grid_pointsCells, "f");
    }
    addPoint(p) {
        if (this.containsPoint(p) === -1) {
            __classPrivateFieldGet(this, _Grid_points, "f").push(p);
            this.updateCells();
            return true;
        }
        return false;
    }
    removePoint(p) {
        if (p instanceof Point) {
            const index = this.containsPoint(p);
            if (index !== -1) {
                this.points.splice(index, 1);
                this.updateCells();
                return true;
            }
            else {
                return false;
            }
        }
        else {
            if (this.points.splice(p, 1)) {
                this.updateCells();
                return true;
            }
            else {
                return false;
            }
        }
    }
    updateCells() {
        // Clear cells to prevent adding points multiple times
        this.clearCells();
        for (let i = 0; i < __classPrivateFieldGet(this, _Grid_points, "f").length; i++) {
            const p = __classPrivateFieldGet(this, _Grid_points, "f")[i];
            const pointIdentifier = p.identifier;
            const posCellIndicies = __classPrivateFieldGet(this, _Grid_instances, "m", _Grid_possibleCellIndicies).call(this, p);
            for (let j = posCellIndicies.left; j <= posCellIndicies.right; j++) {
                for (let k = posCellIndicies.top; k <= posCellIndicies.bottom; k++) {
                    const gridPosition = new Eclipse.Vector2(j * __classPrivateFieldGet(this, _Grid_cellSize, "f") + (this.cellSize / 2), k * __classPrivateFieldGet(this, _Grid_cellSize, "f") + (this.cellSize / 2));
                    const cellPos = new Eclipse.Vector2(j, k);
                    // Checks if any part of the point is inside the grid cell
                    if (gridPosition.dist(p.position) <= p.radius + (__classPrivateFieldGet(this, _Grid_cellSize, "f") * Math.SQRT1_2)) {
                        if (__classPrivateFieldGet(this, _Grid_pointsCells, "f").has(pointIdentifier)) {
                            let existingCells = __classPrivateFieldGet(this, _Grid_pointsCells, "f").get(pointIdentifier);
                            existingCells === null || existingCells === void 0 ? void 0 : existingCells.push(cellPos.toString());
                        }
                        else {
                            __classPrivateFieldGet(this, _Grid_pointsCells, "f").set(pointIdentifier, [cellPos.toString()]);
                        }
                        if (__classPrivateFieldGet(this, _Grid_cells, "f").has(cellPos.toString())) {
                            let existingPoints = __classPrivateFieldGet(this, _Grid_cells, "f").get(cellPos.toString());
                            existingPoints === null || existingPoints === void 0 ? void 0 : existingPoints.push(p);
                            if (existingPoints) {
                                __classPrivateFieldGet(this, _Grid_cells, "f").set(cellPos.toString(), existingPoints);
                            }
                        }
                        else {
                            __classPrivateFieldGet(this, _Grid_cells, "f").set(cellPos.toString(), [p]);
                        }
                    }
                }
            }
        }
    }
    clearCells() {
        __classPrivateFieldSet(this, _Grid_cells, new Map(), "f");
        __classPrivateFieldSet(this, _Grid_pointsCells, new Map(), "f");
    }
    clearAllPoints() {
        __classPrivateFieldSet(this, _Grid_cells, new Map(), "f");
        __classPrivateFieldSet(this, _Grid_pointsCells, new Map(), "f");
        __classPrivateFieldSet(this, _Grid_points, Array(), "f");
    }
    pointOverlapping(p) {
        // FIXME: Implement spacial partitioning
        for (const other of this.points) {
            if (p.identifier !== other.identifier) {
                const totalRadii = p.radius + other.radius;
                if (totalRadii >= p.position.dist(other.position))
                    return true;
            }
        }
        return false;
    }
    /**
     * Returns -1 if the grid does not contain the point specified.
     * Returns the index of the first identical point otherwise.
     */
    containsPoint(p) {
        for (let i = 0; i < __classPrivateFieldGet(this, _Grid_points, "f").length; i++) {
            if (__classPrivateFieldGet(this, _Grid_points, "f")[i].isSameAs(p))
                return i;
        }
        return -1;
    }
    get totalDynamic() {
        let total = 0;
        for (let i = 0; i < __classPrivateFieldGet(this, _Grid_points, "f").length; i++) {
            if (!__classPrivateFieldGet(this, _Grid_points, "f")[i].isStatic)
                total++;
        }
        return total;
    }
    get totalStatic() {
        let total = 0;
        for (let i = 0; i < __classPrivateFieldGet(this, _Grid_points, "f").length; i++) {
            if (__classPrivateFieldGet(this, _Grid_points, "f")[i].isStatic)
                total++;
        }
        return total;
    }
}
_Grid_cells = new WeakMap(), _Grid_points = new WeakMap(), _Grid_cellSize = new WeakMap(), _Grid_pointsCells = new WeakMap(), _Grid_instances = new WeakSet(), _Grid_possibleCellIndicies = function _Grid_possibleCellIndicies(point) {
    let p;
    if (typeof point === 'number') {
        p = __classPrivateFieldGet(this, _Grid_points, "f")[point];
    }
    else {
        p = point;
    }
    return {
        // Right and bottom would be 1 more than necessary if point is right on the edge.
        // Subtract by 1 to avoid any unecessary checks
        left: Math.floor(p.rect.left / __classPrivateFieldGet(this, _Grid_cellSize, "f")),
        top: Math.floor(p.rect.top / __classPrivateFieldGet(this, _Grid_cellSize, "f")),
        right: p.rect.right % __classPrivateFieldGet(this, _Grid_cellSize, "f") === 0 ?
            Math.floor(p.rect.right / __classPrivateFieldGet(this, _Grid_cellSize, "f")) - 0 :
            Math.floor(p.rect.right / __classPrivateFieldGet(this, _Grid_cellSize, "f")),
        bottom: p.rect.bottom % __classPrivateFieldGet(this, _Grid_cellSize, "f") === 0 ?
            Math.floor(p.rect.bottom / __classPrivateFieldGet(this, _Grid_cellSize, "f")) - 0 :
            Math.floor(p.rect.bottom / __classPrivateFieldGet(this, _Grid_cellSize, "f")),
    };
};
module.exports = {
    Grid: Grid,
};
