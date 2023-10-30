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
var _Point__position, _Point__radius, _Point__color, _Point__mass, _Point__lastPosition, _Point__initialPosition, _Point__initialMass, _Point__initialRadius, _Point__initialColor;
require('./eclipse');
class Point {
    constructor(position, mass, radius = 5, color = Eclipse.Color.BLACK) {
        _Point__position.set(this, Eclipse.Vector2.ZERO);
        _Point__radius.set(this, 5);
        _Point__color.set(this, Eclipse.Color.BLACK);
        _Point__mass.set(this, 1);
        _Point__lastPosition.set(this, Eclipse.Vector2.ZERO);
        _Point__initialPosition.set(this, void 0);
        _Point__initialMass.set(this, void 0);
        _Point__initialRadius.set(this, void 0);
        _Point__initialColor.set(this, void 0);
        this.position = position;
        this.mass = mass;
        this.radius = radius;
        this.color = color;
        this.lastPosition = this.position;
        __classPrivateFieldSet(this, _Point__initialColor, __classPrivateFieldGet(this, _Point__color, "f"), "f");
        __classPrivateFieldSet(this, _Point__initialMass, __classPrivateFieldGet(this, _Point__mass, "f"), "f");
        __classPrivateFieldSet(this, _Point__initialPosition, __classPrivateFieldGet(this, _Point__position, "f"), "f");
        __classPrivateFieldSet(this, _Point__initialRadius, __classPrivateFieldGet(this, _Point__radius, "f"), "f");
    }
    get position() {
        return __classPrivateFieldGet(this, _Point__position, "f");
    }
    set position(pos) {
        if (pos instanceof Eclipse.Vector2) {
            __classPrivateFieldSet(this, _Point__position, pos, "f");
        }
        else {
            throw new Error(`pos (${pos}) is not of type Vector2`);
        }
    }
    get x() {
        return __classPrivateFieldGet(this, _Point__position, "f").x;
    }
    set x(x) {
        if (typeof x === 'number') {
            __classPrivateFieldSet(this, _Point__position, new Eclipse.Vector2(x, __classPrivateFieldGet(this, _Point__position, "f").x), "f");
        }
        else {
            throw new Error(`x (${x}) is not of type number`);
        }
    }
    get y() {
        return __classPrivateFieldGet(this, _Point__position, "f").y;
    }
    set y(y) {
        if (typeof y === 'number') {
            __classPrivateFieldSet(this, _Point__position, new Eclipse.Vector2(__classPrivateFieldGet(this, _Point__position, "f").y, y), "f");
        }
        else {
            throw new Error(`y (${y}) is not of type number`);
        }
    }
    get radius() {
        return __classPrivateFieldGet(this, _Point__radius, "f");
    }
    set radius(rad) {
        if (typeof rad === 'number') {
            __classPrivateFieldSet(this, _Point__radius, Eclipse.clamp(rad, 0, Eclipse.INF), "f");
        }
        else {
            throw new Error(`rad (${rad}) is not of type number`);
        }
    }
    get color() {
        return __classPrivateFieldGet(this, _Point__color, "f");
    }
    set color(col) {
        if (col instanceof Eclipse.Color) {
            __classPrivateFieldSet(this, _Point__color, col, "f");
        }
        else {
            throw new Error(`col (${col}) is not of type Color`);
        }
    }
    get mass() {
        return __classPrivateFieldGet(this, _Point__mass, "f");
    }
    set mass(mass) {
        if (typeof mass === 'number') {
            __classPrivateFieldSet(this, _Point__mass, Eclipse.clamp(mass, 0, Eclipse.INF), "f");
        }
        else {
            throw new Error(`Mass (${mass}) is not of type number`);
        }
    }
    get lastPosition() {
        return __classPrivateFieldGet(this, _Point__lastPosition, "f");
    }
    set lastPosition(newLastPosition) {
        if (newLastPosition instanceof Eclipse.Vector2) {
            __classPrivateFieldSet(this, _Point__lastPosition, newLastPosition, "f");
        }
        else {
            throw new Error(`newLastPosition (${newLastPosition}) is not an instance of Vector2`);
        }
    }
    draw(ctx) {
        Eclipse.drawPoint(ctx, this.position, this.radius, this.color);
    }
    reset() {
        this.position = __classPrivateFieldGet(this, _Point__initialPosition, "f");
        this.lastPosition = __classPrivateFieldGet(this, _Point__position, "f");
        this.mass = __classPrivateFieldGet(this, _Point__initialMass, "f");
        this.color = __classPrivateFieldGet(this, _Point__initialColor, "f");
        this.radius = __classPrivateFieldGet(this, _Point__initialRadius, "f");
    }
}
_Point__position = new WeakMap(), _Point__radius = new WeakMap(), _Point__color = new WeakMap(), _Point__mass = new WeakMap(), _Point__lastPosition = new WeakMap(), _Point__initialPosition = new WeakMap(), _Point__initialMass = new WeakMap(), _Point__initialRadius = new WeakMap(), _Point__initialColor = new WeakMap();
module.exports = {
    Point: Point,
};
