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
var _Point_position, _Point_lastPosition, _Point_radius, _Point_color, _Point_mass, _Point_isStatic, _Point_identifier, _Point_appliedForces, _Point_constantAccelerations, _Point_lastVelocity, _Point_onWall, _Point_initialPosition, _Point_initialMass, _Point_initialRadius, _Point_initialColor, _Point_initialIsStatic, _Point_initialVelocity, _Wall_position, _Wall_side, _Wall_color;
require('./eclipse');
class Point {
    constructor(position, mass, radius = 5, color = Eclipse.Color.BLACK, isStatic = false, initialVelocity = Eclipse.Vector2.ZERO) {
        // Standard properties
        _Point_position.set(this, Eclipse.Vector2.ZERO);
        _Point_lastPosition.set(this, Eclipse.Vector2.ZERO);
        _Point_radius.set(this, 5);
        _Point_color.set(this, Eclipse.Color.BLACK);
        _Point_mass.set(this, 1);
        _Point_isStatic.set(this, false);
        _Point_identifier.set(this, void 0);
        _Point_appliedForces.set(this, []);
        _Point_constantAccelerations.set(this, [gravity]);
        _Point_lastVelocity.set(this, Eclipse.Vector2.ZERO);
        _Point_onWall.set(this, false
        // Initial properties
        // Standard properties will be set to these on reset
        );
        // Initial properties
        // Standard properties will be set to these on reset
        _Point_initialPosition.set(this, void 0);
        _Point_initialMass.set(this, void 0);
        _Point_initialRadius.set(this, void 0);
        _Point_initialColor.set(this, void 0);
        _Point_initialIsStatic.set(this, void 0);
        _Point_initialVelocity.set(this, void 0);
        this.position = position;
        this.mass = mass;
        this.radius = radius;
        this.color = color;
        this.isStatic = isStatic;
        // this.velocity = initialVelocity
        __classPrivateFieldSet(this, _Point_initialColor, __classPrivateFieldGet(this, _Point_color, "f"), "f");
        __classPrivateFieldSet(this, _Point_initialMass, __classPrivateFieldGet(this, _Point_mass, "f"), "f");
        __classPrivateFieldSet(this, _Point_initialPosition, __classPrivateFieldGet(this, _Point_position, "f"), "f");
        __classPrivateFieldSet(this, _Point_initialRadius, __classPrivateFieldGet(this, _Point_radius, "f"), "f");
        __classPrivateFieldSet(this, _Point_initialIsStatic, __classPrivateFieldGet(this, _Point_isStatic, "f"), "f");
        __classPrivateFieldSet(this, _Point_initialVelocity, initialVelocity, "f");
        this.velocity = __classPrivateFieldGet(this, _Point_initialVelocity, "f");
        this.lastVelocity = this.velocity;
        __classPrivateFieldSet(this, _Point_identifier, Point.idCounter++, "f");
    }
    get lastVelocity() {
        return __classPrivateFieldGet(this, _Point_lastVelocity, "f");
    }
    set lastVelocity(newLastVelocity) {
        __classPrivateFieldSet(this, _Point_lastVelocity, newLastVelocity, "f");
    }
    get lastVelocityPxPerS() {
        return __classPrivateFieldGet(this, _Point_lastVelocity, "f").getMult(pxPerM);
    }
    set lastVelocityPxPerS(newLastVelocity) {
        __classPrivateFieldSet(this, _Point_lastVelocity, newLastVelocity.getDiv(pxPerM), "f");
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
    // Basic Stormer Method
    // this.position.getSub(this.lastPosition ?? this.position).getDiv(timeStep / 1000).getDiv(pxPerM)
    //
    get velocity() {
        var _a;
        return this.position.getSub((_a = this.lastPosition) !== null && _a !== void 0 ? _a : this.position).getDiv(timeStep / 1000).getDiv(pxPerM);
    }
    get velocityPXPerS() {
        var _a;
        return this.position.getSub((_a = this.lastPosition) !== null && _a !== void 0 ? _a : this.position).getDiv(timeStep / 1000);
    }
    // Changes the last position to change velocity in later calculations
    set velocity(newVel) {
        newVel.mult(pxPerM);
        __classPrivateFieldSet(this, _Point_lastPosition, newVel.getMult(timeStep / 1000).getSub(this.position).getMult(-1), "f");
    }
    set velocityPXPerS(newVel) {
        __classPrivateFieldSet(this, _Point_lastPosition, newVel.getMult(timeStep / 1000).getSub(this.position).getMult(-1), "f");
    }
    get initialVelocity() {
        return __classPrivateFieldGet(this, _Point_initialVelocity, "f").getDiv(pxPerM);
    }
    set initialVelocity(newVel) {
        __classPrivateFieldSet(this, _Point_initialVelocity, newVel.getMult(pxPerM), "f");
        this.velocity = newVel;
    }
    get initialVelocityPxPerM() {
        return this.initialVelocity;
    }
    set initialVelocityPxPerM(newVel) {
        __classPrivateFieldSet(this, _Point_initialVelocity, newVel, "f");
        this.velocityPXPerS = newVel;
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
    get acceleration() {
        __classPrivateFieldSet(this, _Point_constantAccelerations, [gravity], "f");
        let totalForces = Eclipse.Vector2.ZERO;
        for (let i = 0; i < __classPrivateFieldGet(this, _Point_appliedForces, "f").length; i++) {
            totalForces.x += __classPrivateFieldGet(this, _Point_appliedForces, "f")[i].x;
            totalForces.y += __classPrivateFieldGet(this, _Point_appliedForces, "f")[i].y;
        }
        let totalAcceleration = totalForces.getDiv(__classPrivateFieldGet(this, _Point_mass, "f"));
        for (let i = 0; i < __classPrivateFieldGet(this, _Point_constantAccelerations, "f").length; i++) {
            totalAcceleration = totalAcceleration.getAdd(__classPrivateFieldGet(this, _Point_constantAccelerations, "f")[i]);
        }
        return totalAcceleration;
    }
    get onWall() {
        return __classPrivateFieldGet(this, _Point_onWall, "f");
    }
    set onWall(newVal) {
        __classPrivateFieldSet(this, _Point_onWall, newVal, "f");
    }
    get appliedForces() {
        return __classPrivateFieldGet(this, _Point_appliedForces, "f");
    }
    set appliedForces(newAppliedForces) {
        __classPrivateFieldSet(this, _Point_appliedForces, newAppliedForces, "f");
    }
    getNormalForce(surfaceAngle) {
        const angle = gravity.angleBetweenRadians(Eclipse.Vector2.fromRadianAngle(surfaceAngle));
        return gravity.getMult(Math.cos(angle) * this.mass);
    }
    getRelativePosition(other) {
        return new Eclipse.Vector2(other.x - this.x, other.y - this.y);
    }
    draw(ctx) {
        var _a;
        if (ConfigObject.uiConfig.selectedPointOutlineColor &&
            this.identifier === ((_a = controller.selectedPoint) === null || _a === void 0 ? void 0 : _a.identifier) &&
            ConfigObject.uiConfig.selectedPointOutlineRadius) {
            Eclipse.drawPoint(ctx, this.position, this.radius + ConfigObject.uiConfig.selectedPointOutlineRadius / mainCam.zoom, ConfigObject.uiConfig.selectedPointOutlineColor);
        }
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
        this.velocityPXPerS = __classPrivateFieldGet(this, _Point_initialVelocity, "f");
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
            initialIsStatic: __classPrivateFieldGet(this, _Point_initialIsStatic, "f"),
            initialVelocity: JSON.stringify(__classPrivateFieldGet(this, _Point_initialVelocity, "f")),
            appliedForces: JSON.stringify(__classPrivateFieldGet(this, _Point_constantAccelerations, "f")),
            constantAccelerations: JSON.stringify(__classPrivateFieldGet(this, _Point_constantAccelerations, "f")),
        };
    }
    fromJSON(jsonString) {
        const parsedJSON = JSON.parse(jsonString);
        const position = JSON.parse(parsedJSON.position);
        __classPrivateFieldSet(this, _Point_position, new Eclipse.Vector2(position.x, position.y), "f");
        const lastPosition = JSON.parse(parsedJSON.lastPosition);
        if (lastPosition && lastPosition.x !== undefined) {
            __classPrivateFieldSet(this, _Point_lastPosition, new Eclipse.Vector2(lastPosition.x, lastPosition.y), "f");
        }
        else {
            Eclipse.Vector2.ZERO;
        }
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
        const parsedInitVel = JSON.parse(parsedJSON.initialVelocity);
        __classPrivateFieldSet(this, _Point_initialVelocity, new Eclipse.Vector2(parsedInitVel.x, parsedInitVel.y), "f");
        this.velocityPXPerS = __classPrivateFieldGet(this, _Point_initialVelocity, "f");
        __classPrivateFieldSet(this, _Point_appliedForces, [], "f");
        __classPrivateFieldSet(this, _Point_constantAccelerations, [], "f");
        const parsedForcesArray = Array.isArray(parsedJSON.appliedForces) ? [] : JSON.parse(parsedJSON.appliedForces);
        for (let i = 0; i < parsedForcesArray.length; i++) {
            const parsedForces = parsedForcesArray[i];
            __classPrivateFieldGet(this, _Point_constantAccelerations, "f").push(new Eclipse.Vector2(parsedForces.x, parsedForces.y));
        }
        const parsedAccelerationsArray = Array.isArray(parsedJSON.constantAccelerations) ? [] : JSON.parse(parsedJSON.constantAccelerations);
        for (let i = 0; i < parsedAccelerationsArray.length; i++) {
            const parsedAccelerations = parsedAccelerationsArray[i];
            __classPrivateFieldGet(this, _Point_constantAccelerations, "f").push(new Eclipse.Vector2(parsedAccelerations.x, parsedAccelerations.y));
        }
    }
    setNewInitialValues() {
        __classPrivateFieldSet(this, _Point_initialVelocity, this.velocity, "f");
        __classPrivateFieldSet(this, _Point_initialColor, this.color, "f");
        __classPrivateFieldSet(this, _Point_initialIsStatic, this.isStatic, "f");
        __classPrivateFieldSet(this, _Point_initialMass, this.mass, "f");
        __classPrivateFieldSet(this, _Point_initialPosition, this.position, "f");
        __classPrivateFieldSet(this, _Point_initialRadius, this.radius, "f");
    }
    drawMovementArrows(arrowSize, arrowWidth, xColor = Eclipse.Color.GREEN, yColor = Eclipse.Color.BLUE, centreColor = Eclipse.Color.YELLOW, xHoveredColor = Eclipse.Color.FORESTGREEN, yHoveredColor = Eclipse.Color.MIDNIGHTBLUE, centreHoveredColor = Eclipse.Color.GOLD, velocityColor = Eclipse.Color.MAGENTA) {
        const xEnd = this.position.getAdd(Eclipse.Vector2.RIGHT.getMult(this.radius + arrowSize));
        // X Arrow Body
        Eclipse.drawLine(ctx, this.position, xEnd, arrowWidth, controller.selectionArrowHovered === 'x' ? xHoveredColor : xColor);
        // X Arrow Head
        Eclipse.drawPoly(ctx, [
            xEnd,
            new Eclipse.Vector2(xEnd.x - arrowWidth * 2, this.y - arrowWidth * 2),
            new Eclipse.Vector2(xEnd.x - arrowWidth * 2, this.y + arrowWidth * 2),
        ], controller.selectionArrowHovered === 'x' ? xHoveredColor : xColor, 1 / mainCam.zoom, true, controller.selectionArrowHovered === 'x' ? xHoveredColor : xColor);
        const yEnd = this.position.getAdd(Eclipse.Vector2.UP.getMult(this.radius + arrowSize));
        // Y Arrow Body
        Eclipse.drawLine(ctx, this.position, yEnd, arrowWidth, controller.selectionArrowHovered === 'y' ? yHoveredColor : yColor);
        // Y Arrow Head
        Eclipse.drawPoly(ctx, [
            yEnd,
            new Eclipse.Vector2(this.x - arrowWidth * 2, yEnd.y + arrowWidth * 2),
            new Eclipse.Vector2(this.x + arrowWidth * 2, yEnd.y + arrowWidth * 2),
        ], controller.selectionArrowHovered === 'y' ? yHoveredColor : yColor, 1 / mainCam.zoom, true, controller.selectionArrowHovered === 'y' ? yHoveredColor : yColor);
        // Velocity Arrow Body
        Eclipse.drawLine(ctx, this.position, this.velocityPXPerS.getDiv(4).getAdd(this.position), arrowWidth, velocityColor);
        // Velocity Arrow Head
        Eclipse.drawPoint(ctx, this.velocityPXPerS.getDiv(4).getAdd(this.position), arrowWidth, velocityColor);
        // Centre
        Eclipse.drawPoint(ctx, this.position, arrowWidth * 1.5, controller.selectionArrowHovered === 'both' ? centreHoveredColor : centreColor);
    }
    callAfterDisplacement(displacement, callback) {
        const originalPos = this.position;
        const interval = setInterval(() => {
            if (originalPos.dist(this.position) > displacement) {
                clearInterval(interval);
                callback();
            }
        }, 1);
    }
}
_Point_position = new WeakMap(), _Point_lastPosition = new WeakMap(), _Point_radius = new WeakMap(), _Point_color = new WeakMap(), _Point_mass = new WeakMap(), _Point_isStatic = new WeakMap(), _Point_identifier = new WeakMap(), _Point_appliedForces = new WeakMap(), _Point_constantAccelerations = new WeakMap(), _Point_lastVelocity = new WeakMap(), _Point_onWall = new WeakMap(), _Point_initialPosition = new WeakMap(), _Point_initialMass = new WeakMap(), _Point_initialRadius = new WeakMap(), _Point_initialColor = new WeakMap(), _Point_initialIsStatic = new WeakMap(), _Point_initialVelocity = new WeakMap();
Point.idCounter = 0;
class Wall {
    constructor(position, side, color) {
        _Wall_position.set(this, 0);
        _Wall_side.set(this, 'bottom');
        _Wall_color.set(this, Eclipse.Color.BLACK);
        this.position = position;
        this.side = side;
        this.color = color;
    }
    get position() {
        return __classPrivateFieldGet(this, _Wall_position, "f");
    }
    set position(newPos) {
        __classPrivateFieldSet(this, _Wall_position, newPos, "f");
    }
    get side() {
        return __classPrivateFieldGet(this, _Wall_side, "f");
    }
    set side(newSide) {
        __classPrivateFieldSet(this, _Wall_side, newSide, "f");
    }
    get color() {
        return __classPrivateFieldGet(this, _Wall_color, "f");
    }
    set color(newCol) {
        __classPrivateFieldSet(this, _Wall_color, newCol, "f");
    }
    draw() {
        ctx.fillStyle = this.color.toString();
        switch (__classPrivateFieldGet(this, _Wall_side, "f")) {
            case "top":
                ctx.fillRect(0, (this.position * mainCam.zoom) - mainCam.y, canvas.width, -canvas.height + mainCam.y);
                break;
            case "bottom":
                ctx.fillRect(0, (this.position * mainCam.zoom) - mainCam.y, canvas.width, canvas.height + mainCam.y);
                break;
            case "left":
                ctx.fillRect((this.position * mainCam.zoom) - mainCam.x, 0, -canvas.width + mainCam.x, canvas.height);
                break;
            case "right":
                ctx.fillRect((this.position * mainCam.zoom) - mainCam.x, 0, canvas.width + mainCam.x, canvas.height);
                break;
        }
    }
    toJSON() {
        return {
            position: this.position,
            side: this.side,
            color: this.color.toString()
        };
    }
    fromJSON(JSONString) {
        const parsedJSON = JSON.parse(JSONString);
        this.position = parsedJSON.position;
        this.side = parsedJSON.side;
        this.color = new Eclipse.Color(parsedJSON.color);
    }
}
_Wall_position = new WeakMap(), _Wall_side = new WeakMap(), _Wall_color = new WeakMap();
