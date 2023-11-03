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
var _Grid__cells, _Grid__points, _Grid__cellSize;
require('./eclipse');
require('./primitives');
class Grid {
    constructor(points, cellSize = 100) {
        _Grid__cells.set(this, new Map());
        _Grid__points.set(this, Array());
        _Grid__cellSize.set(this, void 0);
        __classPrivateFieldSet(this, _Grid__cellSize, cellSize, "f");
        __classPrivateFieldSet(this, _Grid__points, points, "f");
    }
    get points() {
        return __classPrivateFieldGet(this, _Grid__points, "f");
    }
    get cells() {
        return __classPrivateFieldGet(this, _Grid__cells, "f");
    }
    get cellSize() {
        return __classPrivateFieldGet(this, _Grid__cellSize, "f");
    }
    addPoint(p) {
        __classPrivateFieldGet(this, _Grid__points, "f").push(p);
    }
    updateCells() {
        let cells = [];
        for (let i = 0; i < __classPrivateFieldGet(this, _Grid__points, "f").length; i++) {
            const p = __classPrivateFieldGet(this, _Grid__points, "f")[i];
            const posCellI = this.possibleCellIndicies(p);
            for (let j = posCellI.left; j <= posCellI.right; j++) {
                for (let k = posCellI.top; k <= posCellI.bottom; k++) {
                    const gridPosition = new Eclipse.Vector2(j * __classPrivateFieldGet(this, _Grid__cellSize, "f") + (this.cellSize / 2), k * __classPrivateFieldGet(this, _Grid__cellSize, "f") + (this.cellSize / 2));
                    if (gridPosition.dist(p.position) <= p.radius + ((__classPrivateFieldGet(this, _Grid__cellSize, "f")) / 2)) {
                        cells.push(new Eclipse.Vector2(j, k));
                    }
                }
            }
        }
        return cells;
    }
    possibleCellIndicies(point) {
        let p;
        if (typeof point === 'number') {
            p = __classPrivateFieldGet(this, _Grid__points, "f")[point];
        }
        else {
            p = point;
        }
        return {
            left: Math.floor(p.rect.left / __classPrivateFieldGet(this, _Grid__cellSize, "f")),
            right: p.rect.right % __classPrivateFieldGet(this, _Grid__cellSize, "f") === 0 ?
                Math.floor(p.rect.right / __classPrivateFieldGet(this, _Grid__cellSize, "f")) - 1 :
                Math.floor(p.rect.right / __classPrivateFieldGet(this, _Grid__cellSize, "f")),
            top: Math.floor(p.rect.top / __classPrivateFieldGet(this, _Grid__cellSize, "f")),
            bottom: p.rect.bottom % __classPrivateFieldGet(this, _Grid__cellSize, "f") === 0 ?
                Math.floor(p.rect.bottom / __classPrivateFieldGet(this, _Grid__cellSize, "f")) - 1 :
                Math.floor(p.rect.bottom / __classPrivateFieldGet(this, _Grid__cellSize, "f")),
        };
    }
}
_Grid__cells = new WeakMap(), _Grid__points = new WeakMap(), _Grid__cellSize = new WeakMap();
module.exports = {
    Grid: Grid,
};
