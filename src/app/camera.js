"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Camera_pos, _Camera_zoom;
require('./eclipse');
require('./drawing');
class Camera {
    constructor(pos, zoom) {
        _Camera_pos.set(this, Eclipse.Vector2.ZERO);
        _Camera_zoom.set(this, 1);
        this.pos = pos;
        this.zoom = zoom;
    }
    get pos() {
        return __classPrivateFieldGet(this, _Camera_pos, "f");
    }
    set pos(newPos) {
        __classPrivateFieldSet(this, _Camera_pos, newPos, "f");
    }
    get x() {
        return __classPrivateFieldGet(this, _Camera_pos, "f").x;
    }
    set x(newX) {
        __classPrivateFieldGet(this, _Camera_pos, "f").x = newX;
    }
    get y() {
        return __classPrivateFieldGet(this, _Camera_pos, "f").y;
    }
    set y(newY) {
        __classPrivateFieldGet(this, _Camera_pos, "f").y = newY;
    }
    get zoom() {
        __classPrivateFieldSet(this, _Camera_zoom, Eclipse.clamp(__classPrivateFieldGet(this, _Camera_zoom, "f"), 0.01, Eclipse.INF), "f");
        return __classPrivateFieldGet(this, _Camera_zoom, "f");
    }
    set zoom(newZoom) {
        __classPrivateFieldSet(this, _Camera_zoom, Eclipse.clamp(newZoom, 0.01, Eclipse.INF), "f");
    }
    translate(x, y) {
        if (x instanceof Eclipse.Vector2) {
            __classPrivateFieldGet(this, _Camera_pos, "f").add(x);
        }
        else {
            this.x += x;
            this.y += y !== null && y !== void 0 ? y : 0;
        }
    }
    changeZoom(scale) {
        this.zoom += scale * Math.sqrt(this.zoom);
        __classPrivateFieldSet(this, _Camera_zoom, Eclipse.clamp(this.zoom, 0.01, 50), "f");
    }
}
_Camera_pos = new WeakMap(), _Camera_zoom = new WeakMap();
module.exports = {
    Camera: Camera,
};
