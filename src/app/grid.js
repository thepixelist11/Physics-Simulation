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
var _Grid_instances, _Grid_cells, _Grid_points, _Grid_cellSize, _Grid_possibleCellIndicies;
require('./eclipse');
require('./primitives');
class Grid {
    constructor(points, cellSize) {
        _Grid_instances.add(this);
        _Grid_cells.set(this, new Map());
        _Grid_points.set(this, Array());
        _Grid_cellSize.set(this, void 0);
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
    addPoint(p) {
        __classPrivateFieldGet(this, _Grid_points, "f").push(p);
        this.updateCells();
    }
    updateCells() {
        for (let i = 0; i < __classPrivateFieldGet(this, _Grid_points, "f").length; i++) {
            const p = __classPrivateFieldGet(this, _Grid_points, "f")[i];
            const posCellIndicies = __classPrivateFieldGet(this, _Grid_instances, "m", _Grid_possibleCellIndicies).call(this, p);
            for (let j = posCellIndicies.left; j <= posCellIndicies.right; j++) {
                for (let k = posCellIndicies.top; k <= posCellIndicies.bottom; k++) {
                    const gridPosition = new Eclipse.Vector2(j * __classPrivateFieldGet(this, _Grid_cellSize, "f") + (this.cellSize / 2), k * __classPrivateFieldGet(this, _Grid_cellSize, "f") + (this.cellSize / 2));
                    const cellPos = new Eclipse.Vector2(j, k);
                    // Checks if any part of the point is inside the grid cell
                    if (gridPosition.dist(p.position) <= p.radius + ((__classPrivateFieldGet(this, _Grid_cellSize, "f")) / 2)) {
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
}
_Grid_cells = new WeakMap(), _Grid_points = new WeakMap(), _Grid_cellSize = new WeakMap(), _Grid_instances = new WeakSet(), _Grid_possibleCellIndicies = function _Grid_possibleCellIndicies(point) {
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
            Math.floor(p.rect.right / __classPrivateFieldGet(this, _Grid_cellSize, "f")) - 1 :
            Math.floor(p.rect.right / __classPrivateFieldGet(this, _Grid_cellSize, "f")),
        bottom: p.rect.bottom % __classPrivateFieldGet(this, _Grid_cellSize, "f") === 0 ?
            Math.floor(p.rect.bottom / __classPrivateFieldGet(this, _Grid_cellSize, "f")) - 1 :
            Math.floor(p.rect.bottom / __classPrivateFieldGet(this, _Grid_cellSize, "f")),
    };
};
module.exports = {
    Grid: Grid,
};
