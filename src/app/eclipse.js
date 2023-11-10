"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var Eclipse;
(function (Eclipse) {
    var _KeyBoard_keyboardCodes;
    // ----- MATH FUNCTIONS AND CLASSES
    Eclipse.PI = Math.PI;
    Eclipse.TAU = Eclipse.PI * 2;
    Eclipse.HALFPI = Eclipse.PI / 2;
    Eclipse.QUARTERPI = Eclipse.PI / 4;
    Eclipse.INF = Number.POSITIVE_INFINITY;
    Eclipse.NEGINF = Number.NEGATIVE_INFINITY;
    Eclipse.EPSILON = Number.EPSILON;
    function drawPoint(ctx, x, y, radius = 1, color = Color.BLACK) {
        if (typeof x === 'number' && typeof y === 'number' && !(radius instanceof Color)) {
            // Overload 0
            ctx.fillStyle = color.toString();
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Eclipse.TAU);
            ctx.fill();
        }
        else if (x instanceof Vector2 && typeof y === 'number') {
            // Overload 1
            ctx.fillStyle = radius.toString();
            ctx.beginPath();
            ctx.arc(x.x, x.y, y, 0, Eclipse.TAU);
            ctx.fill();
        }
        else if (Array.isArray(x) && typeof y === 'number') {
            // Overload 2
            ctx.fillStyle = color.toString();
            ctx.beginPath();
            ctx.arc(x[0], x[1], y, 0, Eclipse.TAU);
            ctx.fill();
        }
    }
    Eclipse.drawPoint = drawPoint;
    function drawLine(ctx, x1, y1, x2, y2, weight = 2, color = Color.BLACK) {
        ctx.lineWidth = weight;
        if (typeof x1 === 'number' && typeof x2 === 'number' && typeof y1 === 'number' && typeof y2 === 'number') {
            // Overload 2
            ctx.strokeStyle = color.toString();
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        else if (x1 instanceof Vector2 && y1 instanceof Vector2) {
            // Overload 1
            ctx.strokeStyle = y2.toString();
            ctx.beginPath();
            ctx.moveTo(x1.x, x1.y);
            ctx.lineTo(y1.x, y1.y);
            ctx.stroke();
        }
    }
    Eclipse.drawLine = drawLine;
    // ----- COLOR FUNCTIONS AND CLASSES
    class Color {
        constructor(r = 0, g = 0, b = 0) {
            this.r = 0;
            this.g = 0;
            this.b = 0;
            if (typeof r === 'number') {
                // Overload 0
                this.r = clamp(r, 0, 255);
                this.g = clamp(g, 0, 255);
                this.b = clamp(b, 0, 255);
            }
            else {
                // Overload 1
                if (r.trim()[0] === '#' && r.trim().length === 7) {
                    const hex = r.substring(1, r.length);
                    let colors = new Array(3);
                    try {
                        colors[0] = clamp(parseInt(hex.substring(0, 2), 16), 0, 255);
                        colors[1] = clamp(parseInt(hex.substring(2, 4), 16), 0, 255);
                        colors[2] = clamp(parseInt(hex.substring(4, 6), 16), 0, 255);
                        this.r = colors[0];
                        this.g = colors[1];
                        this.b = colors[2];
                    }
                    catch (_a) {
                        throw new Error(`Hex code ${r} could not be parsed to a color.`);
                    }
                }
                else if (new RegExp('rgb\\(\\s*(-?\\d+)\\s*,\\s*(-?\\d+)\\s*,\\s*(-?\\d+)\\s*\\)').test(r) && typeof r === 'string') {
                    // Regular expression to test whether or not value is in the format 'rgb(number, number, number)'
                    const stringVals = (r.match(new RegExp('rgb\\(\\s*(-?\\d+)\\s*,\\s*(-?\\d+)\\s*,\\s*(-?\\d+)\\s*\\)')) || ['0', '0', '0']).slice(1, 4);
                    const parsedVals = new Array(3);
                    for (let i = 0; i < 3; i++) {
                        parsedVals[i] = parseInt(stringVals[i]);
                    }
                    this.r = clamp(parsedVals[0], 0, 255);
                    this.g = clamp(parsedVals[1], 0, 255);
                    this.b = clamp(parsedVals[2], 0, 255);
                }
                else {
                    throw new Error(`${r} is not a valid hex code or CSS color.`);
                }
            }
        }
        /**
         * Converts the color to a CSS compatible string: rgb(r, g, b)
         * @returns {string}
         */
        toString() {
            return `rgb(${this.r}, ${this.g}, ${this.b})`;
        }
    }
    Color.BLACK = new Color(0, 0, 0);
    Color.WHITE = new Color(255, 255, 255);
    Color.LIGHTGREY = new Color(211, 211, 211);
    Color.DARKGREY = new Color(169, 169, 169);
    Color.GAINSBORO = new Color(220, 220, 220);
    Color.LIGHTSLATEGREY = new Color(132, 148, 164);
    Color.SLATEGRAY = new Color(112, 128, 144);
    Color.DIMGRAY = new Color(105, 105, 105);
    Color.RED = new Color(255, 0, 0);
    Color.GREEN = new Color(0, 255, 0);
    Color.BLUE = new Color(0, 0, 255);
    Color.YELLOW = new Color(255, 255, 0);
    Color.PURPLE = new Color(128, 0, 128);
    Color.CYAN = new Color(0, 255, 255);
    Color.MAGENTA = new Color(255, 0, 255);
    Color.ORANGE = new Color(255, 165, 0);
    Color.PINK = new Color(255, 192, 203);
    Color.LAVENDER = new Color(230, 230, 250);
    Color.INDIGO = new Color(75, 0, 130);
    Color.TEAL = new Color(0, 128, 128);
    Color.MAROON = new Color(128, 0, 0);
    Color.GOLD = new Color(255, 215, 0);
    Color.SILVER = new Color(192, 192, 192);
    Color.BROWN = new Color(54, 36, 5);
    Color.NAVY = new Color(0, 0, 128);
    Color.OLIVE = new Color(128, 128, 0);
    Color.TURQUOISE = new Color(64, 224, 208);
    Color.BEIGE = new Color(245, 245, 220);
    Color.CORAL = new Color(255, 127, 80);
    Color.SALMON = new Color(250, 128, 114);
    Color.PEACH = new Color(255, 218, 185);
    Color.SKYBLUE = new Color(135, 206, 235);
    Color.FORESTGREEN = new Color(34, 139, 34);
    Color.PLUM = new Color(221, 160, 221);
    Color.KHAKI = new Color(240, 230, 140);
    Color.STEELBLUE = new Color(70, 130, 180);
    Color.TAN = new Color(210, 180, 140);
    Color.DARKORCHID = new Color(153, 50, 204);
    Color.ROSYBROWN = new Color(188, 143, 143);
    Color.TOMATO = new Color(255, 99, 71);
    Color.DARKSLATEGRAY = new Color(47, 79, 79);
    Color.SLATEBLUE = new Color(106, 90, 205);
    Color.LEMONCHIFFON = new Color(255, 250, 205);
    Color.MEDIUMAQUAMARINE = new Color(102, 205, 170);
    Color.DARKRED = new Color(139, 0, 0);
    Color.OLIVEDRAB = new Color(107, 142, 35);
    Color.MIDNIGHTBLUE = new Color(25, 25, 112);
    Color.SIENNA = new Color(160, 82, 45);
    Color.CORNFLOWERBLUE = new Color(100, 149, 237);
    Color.LIGHTSEAGREEN = new Color(32, 178, 170);
    Color.DARKSALMON = new Color(233, 150, 122);
    Color.PALEGOLDENROD = new Color(238, 232, 170);
    Color.LIGHTSLATEGRAY = new Color(119, 136, 153);
    Color.DARKSEAGREEN = new Color(143, 188, 143);
    Color.DARKCYAN = new Color(0, 139, 139);
    Color.DARKORANGE = new Color(255, 140, 0);
    Color.MEDIUMVIOLETRED = new Color(199, 21, 133);
    Color.DARKKHAKI = new Color(189, 183, 107);
    Eclipse.Color = Color;
    // ----- VECTOR FUNCTIONS AND CLASSES
    class Vector2 {
        constructor(x = 0, y = 0) {
            this.x = 0;
            this.y = 0;
            if (Array.isArray(x)) {
                this.x = x[0];
                this.y = x[1];
            }
            else if (typeof y !== 'undefined') {
                this.x = x;
                this.y = y;
            }
        }
        /**
         * Sets the x and y values of the vector to the x and y values of another vector
         * @param other The vector to set it to
         * @returns {Vector2}
         */
        set(other) {
            this.x = other.x;
            this.y = other.y;
            return this;
        }
        /**
         * Returns the vector with values added to it
         * @param {number} x The X value or Vector2 to add
         */
        getAdd(x) {
            if (typeof x === 'number') {
                return new Vector2(this.x + x, this.y + x);
            }
            else {
                return new Vector2(this.x + x.x, this.y + x.y);
            }
        }
        /**
         * Adds to the vector
         * @param {number} x The X value or Vector2 to add
         */
        add(x) {
            if (typeof x === 'number') {
                this.x += x;
                this.y += x;
            }
            else {
                this.x += x.x;
                this.y += x.y;
            }
            return this;
        }
        /**
         * Returns the vector with values subtracted from it
         * @param {number} x The X value or Vector2 to subtract by
         */
        getSub(x) {
            if (typeof x === 'number') {
                return new Vector2(this.x - x, this.y - x);
            }
            else {
                return new Vector2(this.x - x.x, this.y - x.y);
            }
        }
        /**
         * Subtracts from the vector
         * @param {number} x The X value or Vector2 to subtract by
         */
        sub(x) {
            if (typeof x === 'number') {
                this.x -= x;
                this.y -= x;
            }
            else {
                this.x -= x.x;
                this.y -= x.y;
            }
            return this;
        }
        /**
         * Returns the vector with values multiplied
         * @param {number} x The X value or Vector2 to multiply by
         */
        getMult(x) {
            if (typeof x === 'number') {
                return new Vector2(this.x * x, this.y * x);
            }
            else {
                return new Vector2(this.x * x.x, this.y * x.y);
            }
        }
        /**
         * Multiplies the vector
         * @param {number} x The X value or Vector2 to multiply by
         */
        mult(x) {
            if (typeof x === 'number') {
                this.x *= x;
                this.y *= x;
            }
            else {
                this.x *= x.x;
                this.y *= x.y;
            }
            return this;
        }
        /**
         * Returns the divided vector
         * @param {number} x The X value or Vector2 to divide by
         */
        getDiv(x) {
            if (typeof x === 'number') {
                if (x === 0) {
                    return new Vector2(0, 0);
                }
                return new Vector2(this.x / x, this.y / x);
            }
            else {
                if (x.x === 0 || x.y === 0) {
                    return new Vector2(0, 0);
                }
                return new Vector2(this.x / x.x, this.y / x.y);
            }
        }
        /**
         * Divides the vector
         * @param {number} x The X value or Vector2 to divide by
         */
        div(x) {
            if (typeof x === 'number') {
                if (x === 0) {
                    this.x = 0;
                    this.y = 0;
                }
                this.x /= x;
                this.y /= x;
            }
            else {
                if (x.x === 0 || x.y === 0) {
                    this.x = 0;
                    this.y = 0;
                }
                this.x /= x.x;
                this.y /= x.y;
            }
            return this;
        }
        /**
         * Returns the vector with values raised or lowered to a different power
         * @param {number} x The X value or Vector2 to be the exponent(s)
         */
        getPow(x) {
            if (typeof x === 'number') {
                return new Vector2(Math.pow(this.x, x), Math.pow(this.y, x));
            }
            else {
                return new Vector2(Math.pow(this.x, x.x), Math.pow(this.y, x.y));
            }
        }
        /**
         * Raises or lowers the vector to a different power
         * @param {number} x The X value or Vector2 to be the exponent(s)
         */
        pow(x) {
            if (typeof x === 'number') {
                this.x ^= x;
                this.y ^= x;
            }
            else {
                this.x ^= x.x;
                this.y ^= x.y;
            }
            return this;
        }
        /**
         * Gets the magnitude (length) of the vector
         * @returns {number}
         */
        mag() {
            return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        }
        /**
         * Gets the angle of the vector in radians
         */
        angleRadians() {
            return Math.atan2(this.y, this.x);
        }
        /**
         * Gets the angle of the vector in radians
         */
        angleDegrees() {
            return radToDeg(Math.atan2(this.y, this.x));
        }
        /**
         * Gets the angle between two vectors in radians
         * @param {Vector2} other
         * @returns {number}
         */
        angleBetweenRadians(other) {
            let thisAngle = this.angleRadians();
            let otherAngle = other.angleRadians();
            return otherAngle - thisAngle;
        }
        /**
         * Gets the angle between two vectors in degrees
         * @param {Vector2} other
         * @returns {number}
         */
        angleBetweenDegrees(other) {
            let thisAngle = this.angleDegrees();
            let otherAngle = other.angleDegrees();
            return otherAngle - thisAngle;
        }
        /**
         * Get the dot product of two vectors
         * @param {Vector2} other The other vector
         * @returns {number}
         */
        dot(other) {
            return this.mag() * other.mag() * Math.cos(this.angleBetweenRadians(other));
        }
        /**
         * Normalize (set the length to 1) a vector
         * @returns {Vector2}
         */
        normalize() {
            if (this.mag() === 0) {
                this.x = 0;
                this.y = 0;
            }
            else {
                this.div(this.mag());
            }
            return this;
        }
        /**
         * Gets the normalized (length == 1) vector. Does not change the vector
         * @returns {Vector2}
         */
        getNormalized() {
            if (this.mag() === 0) {
                return new Vector2(0, 0);
            }
            else {
                return new Vector2(this.x / this.mag(), this.y / this.mag());
            }
        }
        /**
         * Creates and returns a copy of the vector
         */
        copy() {
            return new Vector2(this.x, this.y);
        }
        /**
         * Rotates the vector by a certain angle in radians
         * @param {number} angle The angle in radians to rotate the vector by
         * @param {Vector2} origin The origin vector to rotate around
         * @returns {Vector2}
         */
        rotateRadians(angle, origin = new Vector2(0, 0)) {
            let newVector = this.copy();
            newVector.sub(origin);
            const mag = newVector.mag();
            const newAngle = newVector.angleRadians() + angle;
            newVector.x = Math.cos(newAngle) * mag + origin.x;
            newVector.y = Math.sin(newAngle) * mag + origin.y;
            this.set(newVector);
            return this;
        }
        /**
         * Rotates the vector by a certain angle in degrees
         * @param {number} angle The angle in degrees to rotate the vector by
         * @param {Vector2} origin The origin vector to rotate around
         * @returns {Vector2}
         */
        rotateDegrees(angle, origin = new Vector2(0, 0)) {
            let newVector = this.copy();
            newVector.sub(origin);
            const mag = newVector.mag();
            const newAngle = newVector.angleDegrees() + angle;
            newVector.x = Math.cos(degToRad(newAngle)) * mag + origin.x;
            newVector.y = Math.sin(degToRad(newAngle)) * mag + origin.y;
            this.set(newVector);
            return this;
        }
        /**
         * Gets the rotation of the vector when rotated by an angle in radians
         * @param angle The angle to rotate by in radians
         * @param origin The origin to rotate around
         * @returns {Vector2}
         */
        getRotateRadians(angle, origin = new Vector2(0, 0)) {
            let newVector = this.copy();
            newVector.sub(origin);
            const mag = newVector.mag();
            const newAngle = newVector.angleRadians() + angle;
            newVector.x = Math.cos(newAngle) * mag + origin.x;
            newVector.y = Math.sin(newAngle) * mag + origin.y;
            return newVector;
        }
        /**
         * Gets the rotation of the vector when rotated by an angle in degrees
         * @param angle The angle to rotate by in degrees
         * @param origin The origin to rotate around
         * @returns {Vector2}
         */
        getRotateDegrees(angle, origin = new Vector2(0, 0)) {
            let newVector = this.copy();
            newVector.sub(origin);
            const mag = newVector.mag();
            const newAngle = newVector.angleDegrees() + angle;
            newVector.x = Math.cos(degToRad(newAngle)) * mag + origin.x;
            newVector.y = Math.sin(degToRad(newAngle)) * mag + origin.y;
            return newVector;
        }
        /**
         * Sets the angle of the vector to a specified angle in radians
         * @param angle Angle in radians to set the angle of the vector to
         * @param origin The origin to rotate around
         * @returns {Vector2}
         */
        setAngleRadians(angle, origin = new Vector2(0, 0)) {
            const newVector = this.copy();
            newVector.sub(origin);
            const mag = newVector.mag();
            newVector.x = Math.cos(angle) * mag + origin.x;
            newVector.y = Math.sin(angle) * mag + origin.y;
            this.set(newVector);
            return this;
        }
        /**
         * Sets the angle of the vector to a specified angle in degrees
         * @param angle Angle in degrees to set the angle of the vector to
         * @param origin The origin to rotate around
         * @returns {Vector2}
         */
        setAngleDegrees(angle, origin = new Vector2(0, 0)) {
            const newVector = this.copy();
            newVector.sub(origin);
            const mag = newVector.mag();
            newVector.x = Math.cos(degToRad(angle)) * mag + origin.x;
            newVector.y = Math.sin(degToRad(angle)) * mag + origin.y;
            this.set(newVector);
            return this;
        }
        /**
         * Linearly interpolates one vector to another
         * @param other Vector to lerp to
         * @param amt Amount between 0 and 1 to lerp by (0 is the original vector, 1 is other)
         */
        lerp(other, amt) {
            amt = clamp(amt, 0, 1);
            this.add(other.sub(this)).mult(amt);
            return this;
        }
        /**
         * Gets a linearly interpolated vector between this and other
         * @param other Vector to lerp to
         * @param amt Amount between 0 and 1 to lerp by (0 is the original vector, 1 is other)
         */
        getLerp(other, amt) {
            let newVector = this.copy();
            amt = clamp(amt, 0, 1);
            newVector.add(other.sub(newVector)).mult(amt);
            return newVector;
        }
        /**
         * Checks whether or not two vectors are identical
         * @param other The other vector
         */
        equals(other) {
            if (this.x === other.x && this.y === other.y) {
                return true;
            }
            else {
                return false;
            }
        }
        /**
         * Checks whether or not two vectors are approximately equal to each other based on a certain tolerance
         * @param other The other vector
         * @param tolerance The tolerance of the check. The lower the number, the closer the vectors must be to each other
         */
        approxEquals(other, tolerance = 0.1) {
            const xDiff = other.x - this.x;
            const yDiff = other.y - this.y;
            if (xDiff < tolerance && yDiff < tolerance) {
                return true;
            }
            else {
                return false;
            }
        }
        /**
         * Gets the distance between two vectors
         * @param other The other vector
         */
        dist(other) {
            return Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2));
        }
        /**
         * Returns the vector formatted as: (x, y)
         */
        toString() {
            return `(${this.x}, ${this.y})`;
        }
        /**
         * Returns this vector as an array formatted: [x, y]
         */
        toArray() {
            return [this.x, this.y];
        }
        /**
         * Converts a vector to JSON string
         */
        toJSONString() {
            return `{
        x: ${this.x},
        y: ${this.y}
      }`;
        }
        /**
         * Creates a vector from a value formatted '(x,y)', 'x,y' or an array with it's first two values numbers
         * @param val The value to create the vector from
         */
        static create(val) {
            if (typeof val === 'string') {
                val = removeChars(val, ['(', ')', ' ']);
                if (new RegExp('^-?\\d+,-?\\d+$').test(val)) {
                    const coords = val.split(',');
                    return new Vector2(parseFloat(coords[0]), parseFloat(coords[1]));
                }
                else {
                    throw new Error('Invalid formatting for Vector2.create() | String input');
                }
            }
            else if (Array.isArray(val)) {
                if (typeof val[0] !== 'number' || typeof val[1] !== 'number') {
                    throw new Error('Invalid formatting for Vector.Vec2.create() | Array input');
                }
                else {
                    return new Vector2(val[0], val[1]);
                }
            }
        }
        /**
         * Creates a vector2 with a certain angle (In degrees) and length
         * @param angle The angle of the vector
         * @param length The length/magnitude of the vector
         */
        static fromDegreeAngle(angle, length = 1) {
            const x = parseFloat(Math.cos(degToRad(angle)).toFixed(5)) * length;
            const y = parseFloat(Math.sin(degToRad(angle)).toFixed(5)) * length;
            return new Vector2(x, y);
        }
        /**
         * Creates a vector2 with a certain angle (In radians) and length
         * @param angle The angle of the vector
         * @param length The length/magnitude of the vector
         */
        static fromRadianAngle(angle, length = 1) {
            const x = parseFloat(Math.cos(angle).toFixed(5)) * length;
            const y = parseFloat(Math.sin(angle).toFixed(5)) * length;
            return new Vector2(x, y);
        }
        /**
         * Creates a random vector2
         * @param minX Minimum x position
         * @param maxX Maximum x position
         * @param minY Minimum y position
         * @param maxY Maxmimum y position
         */
        static random(minX = -1, maxX = 1, minY = -1, maxY = 1) {
            const x = random(minX, maxX);
            const y = random(minY, maxY);
            return new Vector2(x, y);
        }
    }
    Vector2.UP = new Vector2(0, -1);
    Vector2.DOWN = new Vector2(0, 1);
    Vector2.LEFT = new Vector2(-1, 0);
    Vector2.RIGHT = new Vector2(1, 0);
    Vector2.UPLEFT = new Vector2(-1, -1);
    Vector2.UPRIGHT = new Vector2(1, -1);
    Vector2.DOWNLEFT = new Vector2(-1, 1);
    Vector2.DOWNRIGHT = new Vector2(1, 1);
    Vector2.ZERO = new Vector2(0, 0);
    Eclipse.Vector2 = Vector2;
    // ------ UTILITY FUNCTIONS
    /**
     * Clamps a value between two numbers
     * @param {number} value The value to clamp
     * @param {number} minimum Minimum number the value can be
     * @param {number} maximum Maximum number the value can be
     * @returns {number}
     */
    function clamp(value, minimum, maximum) {
        return Math.max(minimum, Math.min(maximum, value));
    }
    Eclipse.clamp = clamp;
    /**
     * Returns a deep copy of the value
     * @param value The value to make a deep copy of
     */
    function deepCopy(value) {
        return JSON.parse(JSON.stringify(value));
    }
    Eclipse.deepCopy = deepCopy;
    /**
     * Converts an angle in degrees to radians
     * @param {number} x Angle in degrees to convert to radians
     * @returns {number}
     */
    function degToRad(x) {
        return (x * Eclipse.PI) / 180;
    }
    Eclipse.degToRad = degToRad;
    /**
     * Converts an angle in radians to degrees
     * @param {number} x Angle in radians to convert to degrees
     * @returns {number}
     */
    function radToDeg(x) {
        return (x * 180) / Eclipse.PI;
    }
    Eclipse.radToDeg = radToDeg;
    function removeChars(str, chars) {
        let ret = '';
        for (let i = 0; i < str.length; i++) {
            if (!(chars instanceof RegExp)) {
                if (!chars.includes(str[i])) {
                    ret = ret.concat(str[i]);
                }
            }
            else {
                if (!chars.test(str[i])) {
                    ret = ret.concat(str[i]);
                }
            }
        }
        return ret;
    }
    Eclipse.removeChars = removeChars;
    /**
     * Returns a pseudo-random number between min and max
     * @param min Minimum value for the pseudo-random number
     * @param max Maximum value for the pseudo-random number
     */
    function random(min = 0, max = 1) {
        return Math.random() * (max - min + 1) + min;
    }
    Eclipse.random = random;
    /**
     * Returns the index of the next instance of a specific value(s) in an array after a certain index. Returns -1 if there are no more instances of val(s).
     * @param arr Array to search
     * @param val Value to search for
     * @param index Index to search from
     */
    function next(arr, val, index) {
        if (Array.isArray(val)) {
            for (let i = index; i < arr.length; i++) {
                if (val.includes(arr[i])) {
                    return i;
                }
            }
            return -1;
        }
        else if (val instanceof RegExp) {
            for (let i = index; i < arr.length; i++) {
                if (val.test(arr[i])) {
                    return i;
                }
            }
            return -1;
        }
        else {
            for (let i = index; i < arr.length; i++) {
                if (val === arr[i]) {
                    return i;
                }
            }
            return -1;
        }
    }
    Eclipse.next = next;
    /**
     * Converts a string to camelCase
     * @param val The string to convert to camelCase
     */
    function toCamelCase(val) {
        let ret = '';
        for (let i = 0; i < val.length; i++) {
            if (![' ', '_', '\n', '-'].includes(val[i]) || i === val.length - 1) {
                ret = ret.concat(val[i].toLowerCase());
            }
            else {
                ret = ret.concat(val[next([...val], new RegExp('[^_\\-\\n ]'), i)].toUpperCase());
                i += next([...val], new RegExp('[^_\\-\\n ]'), i) - i;
            }
        }
        return ret;
    }
    Eclipse.toCamelCase = toCamelCase;
    /**
     * Truncates a string to a certain length, and ends it with a suffix.
     * @param val The string to truncate
     * @param max The maximum number of characters that can be in the string
     * @param suffix The suffix to end the string with. These characters do not count towards the maximum. Example: '...'
     */
    function truncate(val, max, suffix = '') {
        return [...val].splice(0, max).join('').concat(suffix);
    }
    Eclipse.truncate = truncate;
    /**
     * Returns an array with it's values shuffled
     * @param arr The array to shuffle
     */
    function shuffle(arr) {
        let buffer = arr;
        let ret = new Array(arr.length);
        for (let i = 0; buffer.length > 0; i++) {
            const rnd = Math.floor(random(0, buffer.length - 1));
            ret[i] = buffer[rnd];
            buffer.splice(rnd, 1);
        }
        return ret;
    }
    Eclipse.shuffle = shuffle;
    /**
     * Converts a string to PascalCase
     * @param val The string to convert to PascalCase
     */
    function toPascalCase(val) {
        let ret = '';
        ret = ret.concat(val[0].toUpperCase());
        for (let i = 1; i < val.length; i++) {
            if (![' ', '_', '\n', '-'].includes(val[i]) || i === val.length - 1) {
                ret = ret.concat(val[i].toLowerCase());
            }
            else {
                ret = ret.concat(val[next([...val], new RegExp('[^_\\-\\n ]'), i)].toUpperCase());
                i += next([...val], new RegExp('[^_\\-\\n ]'), i) - i;
            }
        }
        return ret;
    }
    Eclipse.toPascalCase = toPascalCase;
    /**
     * Converts a string to snake_case
     * @param val The string to convert to snake_case
     */
    function toSnakeCase(val) {
        let ret = '';
        for (let i = 0; i < val.length; i++) {
            if (![' ', '_', '\n', '-'].includes(val[i]) || i === val.length - 1) {
                ret = ret.concat(val[i].toLowerCase());
            }
            else {
                ret = ret.concat('_');
                i += next([...val], new RegExp('[^_\\-\\n ]'), i) - i - 1;
            }
        }
        return ret;
    }
    Eclipse.toSnakeCase = toSnakeCase;
    /**
     * Converts a string to CONSTANT_CASE
     * @param val The string to convert to CONSTANT_CASE
     */
    function toConstantCase(val) {
        let ret = '';
        for (let i = 0; i < val.length; i++) {
            if (![' ', '_', '\n', '-'].includes(val[i]) || i === val.length - 1) {
                ret = ret.concat(val[i].toUpperCase());
            }
            else {
                ret = ret.concat('_');
                i += next([...val], new RegExp('[^_\\-\\n ]'), i) - i - 1;
            }
        }
        return ret;
    }
    Eclipse.toConstantCase = toConstantCase;
    /**
     * Converts a string to kabab-case
     * @param val The string to convert to kebab-case
     */
    function toKebabCase(val) {
        let ret = '';
        for (let i = 0; i < val.length; i++) {
            if (![' ', '_', '\n', '-'].includes(val[i]) || i === val.length - 1) {
                ret = ret.concat(val[i].toLowerCase());
            }
            else {
                ret = ret.concat('-');
                i += next([...val], new RegExp('[^_\\-\\n ]'), i) - i - 1;
            }
        }
        return ret;
    }
    Eclipse.toKebabCase = toKebabCase;
    /**
     * Converts a string to Train-Case
     * @param val The string to convert to Train-Case
     */
    function toTrainCase(val) {
        let ret = '';
        ret = ret.concat(val[0].toUpperCase());
        for (let i = 1; i < val.length; i++) {
            if (![' ', '_', '\n', '-'].includes(val[i]) || i === val.length - 1) {
                ret = ret.concat(val[i].toLowerCase());
            }
            else {
                ret = ret.concat('-');
                ret = ret.concat(val[next([...val], new RegExp('[^_\\-\\n ]'), i)].toUpperCase());
                i += next([...val], new RegExp('[^_\\-\\n ]'), i) - i;
            }
        }
        return ret;
    }
    Eclipse.toTrainCase = toTrainCase;
    /**
     * Formats the date a specified way. To format the date, use yy, yyyy, mm, or dd. Spaces are optional. The delimiter is put between the days months and years and is / by default.
     * @param date The date object to format into a string
     * @param format The format of the date (yyyymmdd, mmddyy, etc...)
     * @param delimiter The delimiter between days, months, and years
     */
    function formatDate(date, format, delimiter = '/') {
        format = format.toLowerCase();
        format = removeChars(format, new RegExp('[^y^d^m]'));
        const d = date.getDate();
        const m = date.getMonth();
        const y = date.getFullYear();
        let ret = '';
        let arrFormat = [];
        let currentVal = format[0];
        let unusedVals = ['y', 'm', 'd'];
        let newVal = '';
        // Put string into array (['yyyy', 'dd', 'mm'])
        for (let i = 0; i < format.length; i++) {
            if (currentVal !== format[i] && unusedVals.includes(format[i])) {
                unusedVals.splice(unusedVals.indexOf(currentVal), 1);
                currentVal = format[i];
                arrFormat.push(newVal);
                newVal = '';
            }
            if (unusedVals.includes(format[i])) {
                newVal = newVal.concat(format[i]);
            }
            if (i === format.length - 1) {
                arrFormat.push(newVal);
            }
        }
        // Fix formatting ('yyyyyy' -> 'yyyy')
        for (let i = 0; i < arrFormat.length; i++) {
            switch (arrFormat[i][0]) {
                case 'y':
                    if (arrFormat[i].length > 4 || arrFormat[i].length === 3) {
                        arrFormat[i] = 'yyyy';
                    }
                    else if (arrFormat[i].length < 2) {
                        arrFormat[i] = 'yy';
                    }
                    break;
                case 'd':
                    arrFormat[i] = 'dd';
                    break;
                case 'm':
                    arrFormat[i] = 'mm';
                    break;
            }
        }
        // Format date and return
        for (let i = 0; i < arrFormat.length; i++) {
            switch (arrFormat[i][0]) {
                case 'y':
                    if (arrFormat[i].length === 4) {
                        ret = ret.concat(y.toString());
                    }
                    else {
                        ret = ret.concat(y.toString().substring(2));
                    }
                    break;
                case 'd':
                    ret = ret.concat(d.toString());
                    break;
                case 'm':
                    ret = ret.concat(m.toString());
                    break;
            }
            if (i !== arrFormat.length - 1) {
                ret = ret.concat(delimiter);
            }
        }
        return ret;
    }
    Eclipse.formatDate = formatDate;
    /**
     * Formats a number with a specified delimiter. Eg: 1000000 -> '1,000,000'
     * @param num The number to format
     * @param delimiter The string to put between every third digit. Defaults to ','
     */
    function formatNumber(num, delimiter = ',') {
        let ret = '';
        if (num.toString().indexOf('.') !== -1) {
            var stringNum = cut(num.toString(), '.');
            var decimal = [...num.toString()].splice(num.toString().indexOf('.')).join('');
        }
        else {
            var stringNum = num.toString();
            var decimal = null;
        }
        for (let i = stringNum.length - 1; i >= 0; i -= 3) {
            const subStr = range([...stringNum], i - 2, i).join('');
            ret = `${subStr}${ret}`;
            ret = `${delimiter}${ret}`;
        }
        if (decimal !== null) {
            ret = ret.concat(decimal);
        }
        const result = new RegExp('^,+(.*)').exec(ret);
        if (result !== null) {
            if (result[1] !== null) {
                return result[1];
            }
            else {
                return result[0];
            }
        }
        return ret;
    }
    Eclipse.formatNumber = formatNumber;
    /**
     * Parses a formatted number (1,000,000.123) to a float
     * @param val The formatted string to parse into a float
     */
    function fromNumberFormat(val) {
        val = removeChars(val, new RegExp('[\\D].'));
        return parseFloat(val);
    }
    Eclipse.fromNumberFormat = fromNumberFormat;
    /**
     * Returns a range of an array between a start and endpoint.
     * @param array The array to get the range from
     * @param start The start index of the range
     * @param end The end index of the range
     */
    function range(array, start, end) {
        end = clamp(end, 0, array.length - 1);
        start = clamp(start, 0, end);
        let ret = [];
        for (let i = start; i <= end; i++) {
            ret.push(array[i]);
        }
        return ret;
    }
    Eclipse.range = range;
    /**
     * Cuts off everything in a string after the first instance of a specific character.
     * @param str The string to cut
     * @param val Everything after the first instance of this value will be removed
     */
    function cut(str, val) {
        if (str.indexOf(val) === -1) {
            return str;
        }
        let ret = '';
        for (let i = 0; i < str.length; i++) {
            if (str[i] === val) {
                break;
            }
            ret = ret.concat(str[i]);
        }
        return ret;
    }
    Eclipse.cut = cut;
    /**
     * Formats a number as money with 2 decimals and a currency symbol.
     * @param val The number to format as money
     * @param symbol The currency symbol ($ or £, for example)
     * @param symbolAfter Show the currency symbol after the number?
     */
    function formatMoney(val, symbol = '$', symbolAfter = false) {
        const fixedNum = val.toFixed(2);
        return symbolAfter ? fixedNum.toString().concat(symbol) : symbol.concat(fixedNum.toString());
    }
    Eclipse.formatMoney = formatMoney;
    /**
     * Checks if a value of type string
     */
    function isString(val) {
        return typeof val === 'string';
    }
    Eclipse.isString = isString;
    /**
     * Checks if a value of type number
     */
    function isNumber(val) {
        return typeof val === 'number';
    }
    Eclipse.isNumber = isNumber;
    /**
     * Checks if a value of type bigint
     */
    function isBigInt(val) {
        return typeof val === 'bigint';
    }
    Eclipse.isBigInt = isBigInt;
    /**
     * Checks if a value of type boolean
     */
    function isBoolean(val) {
        return typeof val === 'boolean';
    }
    Eclipse.isBoolean = isBoolean;
    /**
     * Checks if a value of type function
     */
    function isFunction(val) {
        return typeof val === 'function';
    }
    Eclipse.isFunction = isFunction;
    /**
     * Checks if a value of type object
     */
    function isObject(val) {
        return typeof val === 'object';
    }
    Eclipse.isObject = isObject;
    /**
     * Checks if a value of type symbol
     */
    function isSymbol(val) {
        return typeof val === 'symbol';
    }
    Eclipse.isSymbol = isSymbol;
    /**
     * Checks if a value of type undefined
     */
    function isUndefined(val) {
        return typeof val === 'undefined';
    }
    Eclipse.isUndefined = isUndefined;
    // ------ INPUT FUNCTIONS AND CLASSES
    class Mouse {
        constructor(doc) {
            this.x = -1;
            this.y = -1;
            this.pos = new Vector2(this.x, this.y);
            this.lmb = false;
            this.mmb = false;
            this.rmb = false;
            this.onmove = () => { };
            doc.onmousemove = evt => {
                Object.defineProperty(this, 'x', {
                    value: evt.clientX,
                });
                Object.defineProperty(this, 'y', {
                    value: evt.clientY,
                });
                Object.defineProperty(this, 'pos', {
                    value: new Vector2(this.x, this.y),
                });
                this.onmove();
            };
            doc.onmousedown = evt => {
                switch (evt.button) {
                    case 0:
                        Object.defineProperty(this, 'lmb', {
                            value: true,
                        });
                        break;
                    case 1:
                        Object.defineProperty(this, 'mmb', {
                            value: true,
                        });
                        break;
                    case 2:
                        Object.defineProperty(this, 'rmb', {
                            value: true,
                        });
                        break;
                }
            };
            doc.onmouseup = evt => {
                switch (evt.button) {
                    case 0:
                        Object.defineProperty(this, 'lmb', {
                            value: false,
                        });
                        break;
                    case 1:
                        Object.defineProperty(this, 'mmb', {
                            value: false,
                        });
                        break;
                    case 2:
                        Object.defineProperty(this, 'rmb', {
                            value: false,
                        });
                        break;
                }
            };
        }
        /**
         * Returns a vector2 with the position of the mouse relative to an element. The top-left corner of the element is (0, 0). Returns the position of the mouse if the element does not exist
         * @param element The element
         * @returns {Vector2}
         */
        positionRelativeToElement(element) {
            if (element) {
                const rect = element.getBoundingClientRect();
                return new Vector2(this.x - rect.left, this.y - rect.top);
            }
            else {
                throw new Error(`Element ${element} does not exist`);
            }
        }
        /**
         * Checks if the mouse is over a specific element
         * @param element The element to check
         */
        isOverElement(element) {
            const rect = element.getBoundingClientRect();
            if (this.x > rect.left && this.x < rect.right && this.y > rect.top && this.y < rect.bottom) {
                return true;
            }
            else {
                return false;
            }
        }
        /**
         * Returns the element that the mouse is hovered over
         */
        hoveredElement() {
            return document.elementFromPoint(this.x, this.y);
        }
        /**
         * Hides the mouse cursor when it is on the page
         */
        hide() {
            const body = document.querySelector('body');
            if (body !== null) {
                body.style.cursor = 'none';
            }
        }
        /**
         * Shows the mouse cursor when it is on the page
         */
        show() {
            const body = document.querySelector('body');
            if (body !== null) {
                body.style.cursor = 'default';
            }
        }
        /**
         * Attempts to lock the cursor
         */
        lock() {
            var _a;
            try {
                (_a = document.querySelector('body')) === null || _a === void 0 ? void 0 : _a.requestPointerLock();
            }
            catch (_b) {
                throw new Error('Page is not in focus. Cannot lock cursor');
            }
        }
        /**
         * Unlocks the cursor if it is locked
         */
        unlock() {
            document.exitPointerLock();
        }
    }
    Eclipse.Mouse = Mouse;
    class KeyBoard {
        constructor() {
            this.KeyA = false;
            this.KeyB = false;
            this.KeyC = false;
            this.KeyD = false;
            this.KeyE = false;
            this.KeyF = false;
            this.KeyG = false;
            this.KeyH = false;
            this.KeyI = false;
            this.KeyJ = false;
            this.KeyK = false;
            this.KeyL = false;
            this.KeyM = false;
            this.KeyN = false;
            this.KeyO = false;
            this.KeyP = false;
            this.KeyQ = false;
            this.KeyR = false;
            this.KeyS = false;
            this.KeyT = false;
            this.KeyU = false;
            this.KeyV = false;
            this.KeyW = false;
            this.KeyX = false;
            this.KeyY = false;
            this.KeyZ = false;
            this.Digit1 = false;
            this.Digit2 = false;
            this.Digit3 = false;
            this.Digit4 = false;
            this.Digit5 = false;
            this.Digit6 = false;
            this.Digit7 = false;
            this.Digit8 = false;
            this.Digit9 = false;
            this.Digit0 = false;
            this.Space = false;
            this.ArrowUp = false;
            this.ArrowDown = false;
            this.ArrowLeft = false;
            this.ArrowRight = false;
            this.Enter = false;
            this.Backspace = false;
            this.Tab = false;
            this.ShiftLeft = false;
            this.ControlLeft = false;
            this.AltLeft = false;
            this.MetaLeft = false;
            this.ShiftRight = false;
            this.ControlRight = false;
            this.AltRight = false;
            this.MetaRight = false;
            this.Escape = false;
            this.F1 = false;
            this.F2 = false;
            this.F3 = false;
            this.F4 = false;
            this.F5 = false;
            this.F6 = false;
            this.F7 = false;
            this.F8 = false;
            this.F9 = false;
            this.F10 = false;
            this.F11 = false;
            this.F12 = false;
            this.PrintScreen = false;
            this.ScrollLock = false;
            this.Pause = false;
            this.Backquote = false;
            this.Minus = false;
            this.Equal = false;
            this.BracketLeft = false;
            this.BracketRight = false;
            this.Semicolon = false;
            this.Quote = false;
            this.Backslash = false;
            this.Comma = false;
            this.Period = false;
            this.Slash = false;
            this.Insert = false;
            this.Delete = false;
            this.Home = false;
            this.End = false;
            this.PageUp = false;
            this.PageDown = false;
            this.CapsLock = false;
            this.ContextMenu = false;
            this.Numpad0 = false;
            this.Numpad1 = false;
            this.Numpad2 = false;
            this.Numpad3 = false;
            this.Numpad4 = false;
            this.Numpad5 = false;
            this.Numpad6 = false;
            this.Numpad7 = false;
            this.Numpad8 = false;
            this.Numpad9 = false;
            this.NumpadMultiply = false;
            this.NumpadAdd = false;
            this.NumpadSubtract = false;
            this.NumpadDecimal = false;
            this.NumpadDivide = false;
            this.NumpadEnter = false;
            this.NumLock = false;
            _KeyBoard_keyboardCodes.set(this, [
                'KeyA',
                'KeyB',
                'KeyC',
                'KeyD',
                'KeyE',
                'KeyF',
                'KeyG',
                'KeyH',
                'KeyI',
                'KeyJ',
                'KeyK',
                'KeyL',
                'KeyM',
                'KeyN',
                'KeyO',
                'KeyP',
                'KeyQ',
                'KeyR',
                'KeyS',
                'KeyT',
                'KeyU',
                'KeyV',
                'KeyW',
                'KeyX',
                'KeyY',
                'KeyZ',
                'Digit1',
                'Digit2',
                'Digit3',
                'Digit4',
                'Digit5',
                'Digit6',
                'Digit7',
                'Digit8',
                'Digit9',
                'Digit0',
                'Space',
                'ArrowUp',
                'ArrowDown',
                'ArrowLeft',
                'ArrowRight',
                'Enter',
                'Backspace',
                'Tab',
                'ShiftLeft',
                'ControlLeft',
                'AltLeft',
                'MetaLeft',
                'ShiftRight',
                'ControlRight',
                'AltRight',
                'MetaRight',
                'Escape',
                'F1',
                'F2',
                'F3',
                'F4',
                'F5',
                'F6',
                'F7',
                'F8',
                'F9',
                'F10',
                'F11',
                'F12',
                'PrintScreen',
                'ScrollLock',
                'Pause',
                'Backquote',
                'Minus',
                'Equal',
                'BracketLeft',
                'BracketRight',
                'Semicolon',
                'Quote',
                'Backslash',
                'Comma',
                'Period',
                'Slash',
                'Insert',
                'Delete',
                'Home',
                'End',
                'PageUp',
                'PageDown',
                'CapsLock',
                'ContextMenu',
                'Numpad0',
                'Numpad1',
                'Numpad2',
                'Numpad3',
                'Numpad4',
                'Numpad5',
                'Numpad6',
                'Numpad7',
                'Numpad8',
                'Numpad9',
                'NumpadMultiply',
                'NumpadAdd',
                'NumpadSubtract',
                'NumpadDecimal',
                'NumpadDivide',
                'NumpadEnter',
                'NumLock',
            ]);
            document.onkeydown = evt => {
                Object.defineProperty(this, evt.code, {
                    value: true,
                });
            };
            document.onkeyup = evt => {
                Object.defineProperty(this, evt.code, {
                    value: false,
                });
            };
            document.onblur = () => {
                this.clearKeys();
            };
        }
        /**
         * Clears all the key inputs
         */
        clearKeys() {
            for (let i = 0; i < __classPrivateFieldGet(this, _KeyBoard_keyboardCodes, "f").length; i++) {
                const key = __classPrivateFieldGet(this, _KeyBoard_keyboardCodes, "f")[i];
                Object.defineProperty(this, key, {
                    value: false,
                });
            }
        }
        /**
         * Returns true if any shift key is pressed
         */
        shiftDown() {
            return this.ShiftLeft || this.ShiftRight;
        }
        /**
         * Returns true if any alt key is pressed
         */
        altDown() {
            return this.AltLeft || this.AltRight;
        }
        /**
         * Returns true if any control key is pressed
         */
        ctrlDown() {
            return this.ControlLeft || this.ControlRight;
        }
        /**
         * Returns the currently focused element.
         */
        focused() {
            const focus = document.querySelector(':focus');
            const body = document.querySelector('body');
            if (focus !== null) {
                return focus;
            }
            if (body !== null) {
                return body;
            }
            return new Element();
        }
    }
    _KeyBoard_keyboardCodes = new WeakMap();
    Eclipse.KeyBoard = KeyBoard;
    // ------ FILES FUNCTIONS AND CLASSES
    /**
     * Downloads a file from a path
     * @param filePath The path to the file to download
     * @param fileName The name of the file. Must include the extension of the file
     */
    function downloadFromPath(filePath, fileName) {
        const a = document.createElement('a');
        a.href = filePath;
        a.download = fileName;
        a.click();
    }
    Eclipse.downloadFromPath = downloadFromPath;
    function downloadTextFile(text, name) {
        const a = document.createElement('a');
        a.href = `data:text/plain,${text}`;
        a.download = name;
        a.click();
    }
    Eclipse.downloadTextFile = downloadTextFile;
    /**
     * Downloads the contents of a canvas
     * @param canvas The canvas or canvas context to download
     * @param fileName The name of the file. If no extension is provided, the extension will default to png
     */
    // FIXME: jpg not working. jpeg is
    function downloadCanvas(canvas, fileName) {
        if (canvas instanceof CanvasRenderingContext2D) {
            canvas = canvas.canvas;
        }
        const result = new RegExp('.*\\.(.*)').exec(fileName);
        let data;
        if (result) {
            if (result[1]) {
                data = canvas.toDataURL(`image/${result[1]}`);
            }
            else {
                data = canvas.toDataURL();
            }
        }
        const a = document.createElement('a');
        a.download = fileName;
        if (data) {
            a.href = data;
        }
        a.click();
    }
    Eclipse.downloadCanvas = downloadCanvas;
    // ------ DOM FUNCTIONS AND CLASSES
    function addElement(element, parent) {
        if (!parent) {
            const html = document.querySelector('html');
            if (html) {
                parent = html;
            }
        }
        if (!parent) {
            return;
        }
        parent.appendChild(element);
    }
    Eclipse.addElement = addElement;
})(Eclipse || (Eclipse = {}));
// ------ DATA STRUCTURES
module.exports = {
    Eclipse: Eclipse,
};
