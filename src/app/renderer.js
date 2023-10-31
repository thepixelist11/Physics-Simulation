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
let time = 0;
const timeStep = 16.67;
function startPhysics() {
    time = 0;
    loopPhysics = true;
    const loop = setInterval(() => {
        if (!loopPhysics) {
            clearInterval(loop);
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updatePoints(1, points);
        if (points[0].y > 20000) {
            window.alert(time / 1000);
            stopPhysics();
        }
        drawPoints(points);
        time += timeStep;
    }, timeStep);
}
function stopPhysics() {
    loopPhysics = false;
    resetPoints();
}
drawPoints(points);
function setupDebugProperties() {
    // @ts-ignore
    window.startPhysics = startPhysics;
    function getPoints() { return points; }
    // @ts-ignore
    window.getPoints = getPoints;
}
setupDebugProperties();
