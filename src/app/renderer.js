"use strict";
var _a, _b;
require('./eclipse');
require('./primitives');
require('./physics');
const { ipcRenderer } = require('electron');
const canvas = (_a = document.querySelector('canvas')) !== null && _a !== void 0 ? _a : document.createElement('canvas');
const ctx = (_b = canvas.getContext('2d')) !== null && _b !== void 0 ? _b : new CanvasRenderingContext2D();
canvas.width = 800;
canvas.height = 600;
ipcRenderer.on('newSize', (evt, val) => {
    canvas.width = val[0];
    canvas.height = val[1];
    drawPoints(points);
});
let points = initializePoints();
let loopPhysics = false;
let zoom = 0.1;
function initializePoints() {
    return [new Point(new Eclipse.Vector2(500, 0), 1, 50, Eclipse.Color.RED)];
}
function resetPoints() {
    for (let i = 0; i < points.length; i++) {
        points[i].reset();
    }
}
function drawPoints(points) {
    ctx.save();
    ctx.scale(zoom, zoom);
    for (let i = 0; i < points.length; i++) {
        points[i].draw(ctx);
    }
    ctx.restore();
}
let currentTime, deltaTime, lastTime, start = null;
function startPhysics() {
    loopPhysics = true;
    setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (loopPhysics) {
            if (lastTime === null || lastTime === undefined) {
                lastTime = new Date().getTime();
            }
            if (start === null || start === undefined) {
                start = new Date().getTime();
            }
            currentTime = new Date().getTime();
            deltaTime = currentTime - lastTime;
            updatePoints(1, points);
            if (points[0].y > 10000) {
                window.alert((new Date().getTime() - start) / 1000);
                stopPhysics();
            }
            lastTime = currentTime;
        }
        drawPoints(points);
    }, 16.67);
}
window.startPhysics = startPhysics;
function stopPhysics() {
    loopPhysics = false;
    lastTime = null;
    start = null;
    currentTime = null;
    resetPoints();
}
drawPoints(points);
