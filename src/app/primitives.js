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
var _Point_position, _Point_lastPosition, _Point_radius, _Point_color, _Point_mass, _Point_isStatic, _Point_identifier, _Point_initialPosition, _Point_initialMass, _Point_initialRadius, _Point_initialColor, _Point_initialIsStatic;
require('./eclipse');
class Point {
    constructor(position, mass, radius = 5, color = Eclipse.Color.BLACK, isStatic = false) {
        // Standard properties
        _Point_position.set(this, Eclipse.Vector2.ZERO);
        _Point_lastPosition.set(this, null);
        _Point_radius.set(this, 5);
        _Point_color.set(this, Eclipse.Color.BLACK);
        _Point_mass.set(this, 1);
        _Point_isStatic.set(this, false);
        _Point_identifier.set(this, void 0);
        // Initial properties
        // Standard properties will be set to these on reset
        _Point_initialPosition.set(this, void 0);
        _Point_initialMass.set(this, void 0);
        _Point_initialRadius.set(this, void 0);
        _Point_initialColor.set(this, void 0);
        _Point_initialIsStatic.set(this, void 0);
        this.position = position;
        this.mass = mass;
        this.radius = radius;
        this.color = color;
        this.lastPosition = position;
        this.isStatic = isStatic;
        __classPrivateFieldSet(this, _Point_initialColor, __classPrivateFieldGet(this, _Point_color, "f"), "f");
        __classPrivateFieldSet(this, _Point_initialMass, __classPrivateFieldGet(this, _Point_mass, "f"), "f");
        __classPrivateFieldSet(this, _Point_initialPosition, __classPrivateFieldGet(this, _Point_position, "f"), "f");
        __classPrivateFieldSet(this, _Point_initialRadius, __classPrivateFieldGet(this, _Point_radius, "f"), "f");
        __classPrivateFieldSet(this, _Point_initialIsStatic, __classPrivateFieldGet(this, _Point_isStatic, "f"), "f");
        __classPrivateFieldSet(this, _Point_identifier, Point.idCounter++, "f");
    }
    get position() {
        return __classPrivateFieldGet(this, _Point_position, "f");
    }
    set position(pos) {
        if (pos instanceof Eclipse.Vector2) {
            __classPrivateFieldSet(this, _Point_position, pos, "f");
        }
        else {
            throw new Error(`pos (${pos}) is not of type Vector2`);
        }
    }
    get x() {
        return __classPrivateFieldGet(this, _Point_position, "f").x;
    }
    set x(x) {
        if (typeof x === 'number') {
            __classPrivateFieldSet(this, _Point_position, new Eclipse.Vector2(x, __classPrivateFieldGet(this, _Point_position, "f").y), "f");
        }
        else {
            throw new Error(`x (${x}) is not of type number`);
        }
    }
    get y() {
        return __classPrivateFieldGet(this, _Point_position, "f").y;
    }
    set y(y) {
        if (typeof y === 'number') {
            __classPrivateFieldSet(this, _Point_position, new Eclipse.Vector2(__classPrivateFieldGet(this, _Point_position, "f").x, y), "f");
        }
        else {
            throw new Error(`y (${y}) is not of type number`);
        }
    }
    get radius() {
        return __classPrivateFieldGet(this, _Point_radius, "f");
    }
    set radius(rad) {
        if (typeof rad === 'number') {
            __classPrivateFieldSet(this, _Point_radius, Eclipse.clamp(rad, 0, Eclipse.INF), "f");
        }
        else {
            throw new Error(`rad (${rad}) is not of type number`);
        }
    }
    get color() {
        return __classPrivateFieldGet(this, _Point_color, "f");
    }
    set color(col) {
        if (col instanceof Eclipse.Color) {
            __classPrivateFieldSet(this, _Point_color, col, "f");
        }
        else {
            throw new Error(`col (${col}) is not of type Color`);
        }
    }
    get mass() {
        return __classPrivateFieldGet(this, _Point_mass, "f");
    }
    set mass(mass) {
        if (typeof mass === 'number') {
            __classPrivateFieldSet(this, _Point_mass, Eclipse.clamp(mass, 0, Eclipse.INF), "f");
        }
        else {
            throw new Error(`Mass (${mass}) is not of type number`);
        }
    }
    get lastPosition() {
        return __classPrivateFieldGet(this, _Point_lastPosition, "f");
    }
    set lastPosition(newLastPosition) {
        __classPrivateFieldSet(this, _Point_lastPosition, newLastPosition, "f");
    }
    get isStatic() {
        return __classPrivateFieldGet(this, _Point_isStatic, "f");
    }
    set isStatic(isStatic) {
        __classPrivateFieldSet(this, _Point_isStatic, isStatic, "f");
    }
    get velocity() {
        var _a;
        return __classPrivateFieldGet(this, _Point_position, "f").getSub((_a = __classPrivateFieldGet(this, _Point_lastPosition, "f")) !== null && _a !== void 0 ? _a : Eclipse.Vector2.ZERO);
    }
    get identifier() {
        return __classPrivateFieldGet(this, _Point_identifier, "f");
    }
    get rect() {
        return {
            left: this.x - this.radius,
            right: this.x + this.radius,
            top: this.y - this.radius,
            bottom: this.y + this.radius,
        };
    }
    draw(ctx) {
        Eclipse.drawPoint(ctx, this.position, this.radius, this.color);
    }
    // Sets the standard properties to the initial properties, resetting the point
    reset() {
        this.position = __classPrivateFieldGet(this, _Point_initialPosition, "f");
        this.lastPosition = this.position;
        this.mass = __classPrivateFieldGet(this, _Point_initialMass, "f");
        this.color = __classPrivateFieldGet(this, _Point_initialColor, "f");
        this.radius = __classPrivateFieldGet(this, _Point_initialRadius, "f");
        __classPrivateFieldSet(this, _Point_isStatic, __classPrivateFieldGet(this, _Point_initialIsStatic, "f"), "f");
    }
    isSameAs(other) {
        if (this.x === other.x &&
            this.y === other.y &&
            this.radius === other.radius &&
            this.mass === other.mass)
            return true;
        else
            return false;
    }
    toJSON() {
        return {
            position: JSON.stringify(__classPrivateFieldGet(this, _Point_position, "f")),
            lastPosition: JSON.stringify(__classPrivateFieldGet(this, _Point_lastPosition, "f")),
            radius: __classPrivateFieldGet(this, _Point_radius, "f"),
            color: JSON.stringify(__classPrivateFieldGet(this, _Point_color, "f")),
            mass: __classPrivateFieldGet(this, _Point_mass, "f"),
            isStatic: __classPrivateFieldGet(this, _Point_isStatic, "f"),
            identifier: __classPrivateFieldGet(this, _Point_identifier, "f"),
            initialPosition: JSON.stringify(__classPrivateFieldGet(this, _Point_initialPosition, "f")),
            initialMass: JSON.stringify(__classPrivateFieldGet(this, _Point_initialMass, "f")),
            initialColor: JSON.stringify(__classPrivateFieldGet(this, _Point_initialColor, "f")),
            initialRadius: __classPrivateFieldGet(this, _Point_initialRadius, "f"),
            initialIsStatic: __classPrivateFieldGet(this, _Point_initialIsStatic, "f")
        };
    }
    fromJSON(jsonString) {
        const parsedJSON = JSON.parse(jsonString);
        const position = JSON.parse(parsedJSON.position);
        __classPrivateFieldSet(this, _Point_position, new Eclipse.Vector2(position.x, position.y), "f");
        const lastPosition = JSON.parse(parsedJSON.lastPosition);
        __classPrivateFieldSet(this, _Point_lastPosition, new Eclipse.Vector2(lastPosition.x, lastPosition.y), "f");
        __classPrivateFieldSet(this, _Point_radius, parseFloat(parsedJSON.radius), "f");
        const color = JSON.parse(parsedJSON.color);
        __classPrivateFieldSet(this, _Point_color, new Eclipse.Color(color.r, color.g, color.b), "f");
        __classPrivateFieldSet(this, _Point_mass, parseFloat(parsedJSON.mass), "f");
        __classPrivateFieldSet(this, _Point_isStatic, Boolean(parsedJSON.isStatic), "f");
        __classPrivateFieldSet(this, _Point_identifier, parsedJSON.identifier, "f");
        const initPosition = JSON.parse(parsedJSON.initialPosition);
        __classPrivateFieldSet(this, _Point_initialPosition, new Eclipse.Vector2(initPosition.x, initPosition.y), "f");
        __classPrivateFieldSet(this, _Point_initialMass, parseFloat(parsedJSON.initialMass), "f");
        const initColor = JSON.parse(parsedJSON.initialColor);
        __classPrivateFieldSet(this, _Point_initialColor, new Eclipse.Color(initColor.r, initColor.g, initColor.b), "f");
        __classPrivateFieldSet(this, _Point_initialRadius, parseFloat(parsedJSON.initialRadius), "f");
        __classPrivateFieldSet(this, _Point_initialIsStatic, Boolean(parsedJSON.initialIsStatic), "f");
    }
}
_Point_position = new WeakMap(), _Point_lastPosition = new WeakMap(), _Point_radius = new WeakMap(), _Point_color = new WeakMap(), _Point_mass = new WeakMap(), _Point_isStatic = new WeakMap(), _Point_identifier = new WeakMap(), _Point_initialPosition = new WeakMap(), _Point_initialMass = new WeakMap(), _Point_initialRadius = new WeakMap(), _Point_initialColor = new WeakMap(), _Point_initialIsStatic = new WeakMap();
Point.idCounter = 0;
module.exports = {
    Point: Point,
};
