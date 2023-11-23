"use strict";
var _a, _b;
require('./eclipse');
require('./primitives');
require('./physics');
require('./drawing');
require('./camera');
require('./grid');
require('./controller');
const { ipcRenderer } = require('electron');
const canvas = (_a = document.querySelector('canvas')) !== null && _a !== void 0 ? _a : document.createElement('canvas');
const ctx = (_b = canvas.getContext('2d')) !== null && _b !== void 0 ? _b : new CanvasRenderingContext2D();
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
// Resizes and redraws the canvas when the window is resized. Called from main.js
ipcRenderer.on('newSize', (evt, val) => {
    canvas.width = val[0];
    canvas.height = val[1];
    drawScene(mainGrid, ctx, mainCam, Config.uiConfig);
});
// Initializes main grid
let mainGrid = new Grid([
    new Point(new Eclipse.Vector2(0, 0), 1, 30, Eclipse.Color.RED, false),
    new Point(new Eclipse.Vector2(0, -500), 1, 70, Eclipse.Color.GREEN, false),
    new Point(new Eclipse.Vector2(10, -100), 1, 30, Eclipse.Color.RED, false),
    new Point(new Eclipse.Vector2(-60, -200), 1, 30, Eclipse.Color.RED, false),
    new Point(new Eclipse.Vector2(-200, 400), 1, 200, Eclipse.Color.BLUE, true),
    new Point(new Eclipse.Vector2(200, 400), 1, 200, Eclipse.Color.BLUE, true),
], 100);
// generatePointGrid(500, 1500, 30, Eclipse.Color.BLUE, 200, 200, 40, 1200)
function generatePointGrid(width, height, radii, color, spacingX, spacingY, offsetX, offsetY, isStatic = true) {
    for (let i = -width / 2 + offsetX; i <= width / 2 + offsetX; i += spacingX) {
        for (let j = -height / 2 + offsetY; j <= height / 2 + offsetY; j += spacingY) {
            mainGrid.addPoint(new Point(new Eclipse.Vector2(i, j), 1, radii, color, isStatic));
        }
    }
}
// Number of pixels per metre
const pxPerM = 100;
// Initialize main camera
let mainCam = new Camera(Eclipse.Vector2.ZERO, 0.2);
const controller = new Controller(mainGrid, ctx, mainCam, document);
controller.mouse.onmove = () => {
    drawScene(mainGrid, ctx, mainCam, Config.uiConfig);
};
// Configuration for simulation
const Config = {
    uiConfig: {
        cameraPos: {
            enabled: true,
            position: new Eclipse.Vector2(5, 15),
            color: Eclipse.Color.BLACK,
            cam: mainCam,
            camX: true,
            camY: true,
            camZoom: true,
        },
        globalMousePos: {
            enabled: true,
            position: new Eclipse.Vector2(5, 30),
            color: Eclipse.Color.BLACK,
            mouse: controller.mouse,
            cam: mainCam,
        },
        relativeMousePos: {
            enabled: true,
            position: new Eclipse.Vector2(5, 45),
            color: Eclipse.Color.BLACK,
            mouse: controller.mouse,
            cam: mainCam,
        },
        gridIndex: {
            enabled: true,
            position: new Eclipse.Vector2(5, 60),
            color: Eclipse.Color.BLACK,
            mouse: controller.mouse,
            grid: mainGrid,
            cam: mainCam,
        }
    }
};
function resetPoints() {
    for (let i = 0; i < mainGrid.points.length; i++) {
        mainGrid.points[i].reset();
    }
    mainGrid.updateCells();
}
// When false will call cancelInterval in main loop
let loopPhysics = false;
// Time since simulation started in ms
let time = 0;
// Time in ms to pass per frame. Lower number reduces performance, but increases accuracy. 
// Do not go below 0.01667 or results will be inaccurate due to numerical instability of floats
const timeStep = 166.7;
// The desired fps to run at. Does not affect the update timestep
const FPS = 16.67;
function startPhysics() {
    time = 0;
    loopPhysics = true;
    // Main loop
    const loop = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < Math.ceil((FPS * 1000) / (timeStep * 1000)); i++) {
            if (!loopPhysics) {
                clearInterval(loop);
                break;
            }
            updatePoints(timeStep / 1000, mainGrid, pxPerM);
            // Find how long it takes for point 0 to fall a certain number of units
            if (mainGrid.points[0].y > 1000 * pxPerM) {
                window.alert(time / 1000);
                stopPhysics();
            }
            // Increment time
            time += timeStep;
        }
        drawScene(mainGrid, ctx, mainCam, Config.uiConfig);
    }, FPS);
}
function stopPhysics() {
    loopPhysics = false;
    resetPoints();
}
drawScene(mainGrid, ctx, mainCam, Config.uiConfig);
