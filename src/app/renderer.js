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
    drawScene(mainGrid, ctx, mainCam, ConfigObject);
});
// Clears all points
ipcRenderer.on('clearAllPoints', (evt, val) => {
    mainGrid.clearAllPoints();
    drawScene(mainGrid, ctx, mainCam, ConfigObject);
});
// Saves the simulation to a specified directory
ipcRenderer.on('saveSim', (evt, val) => {
    if (val) {
        saveSimulation(val);
    }
});
// Loads the simulation from a specific .simsave file
ipcRenderer.on('loadSim', (evt, val) => {
    if (val) {
        loadSimulation(val);
    }
});
ipcRenderer.on('lostFocus', (evt, val) => {
    controller.keyboard.clearKeys();
    windowInFocus = false;
});
window.addEventListener('focus', (evt) => {
    windowInFocus = true;
});
// Initialize main camera
let mainCam = new Camera(Eclipse.Vector2.ZERO, 0.5);
// Initializes main grid
let mainGrid = new Grid([], 100);
let windowInFocus = true;
// Initializes main controller
const controller = new Controller(mainGrid, ctx, mainCam, document);
controller.mouse.onmove = () => {
    drawScene(mainGrid, ctx, mainCam, ConfigObject);
};
controller.pointPlacementRadius = 20;
controller.pointDynamicPlacementColor = Eclipse.Color.RED;
controller.pointStaticPlacementColor = Eclipse.Color.BLUE;
// Number of pixels per metre
const pxPerM = 100;
// Configuration for simulation
let ConfigObject = {
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
        },
        cursorDisplay: {
            enabled: true,
            grid: mainGrid,
            controller: controller,
            type: 'pointPlace',
            opacity: 0.5,
            cam: mainCam
        },
        entityDisplay: {
            enabled: true,
            grid: mainGrid,
            position: new Eclipse.Vector2(5, 75),
            staticColor: Eclipse.Color.BLUE,
            dynamicColor: Eclipse.Color.RED,
            totalColor: Eclipse.Color.BLACK,
            showDynamic: true,
            showStatic: true,
            showTotal: true,
            spacingBetweenTotals: 3
        },
        selectedIdentifier: {
            enabled: true,
            position: new Eclipse.Vector2(5, 90),
            color: Eclipse.Color.BLACK,
            cam: mainCam
        },
        cellSize: pxPerM,
        drawGridLines: true,
        selectedPointOutlineColor: Eclipse.Color.GREEN,
        selectedPointOutlineRadius: 5,
    },
    generalConfig: {
        useSpacialPartitioning: true,
        spacPartCellSize: 500,
        allowDynamicPointsOnPoints: false,
        allowStaticPointsOnPoints: true,
    },
    debugConfig: {
        fillFilledGridCells: false,
    }
};
mainGrid.cellSize = ConfigObject.generalConfig.spacPartCellSize;
function generatePointGrid(width, height, radii, color, spacingX, spacingY, offsetX, offsetY, isStatic = true) {
    for (let i = -width / 2 + offsetX; i <= width / 2 + offsetX; i += spacingX) {
        for (let j = -height / 2 + offsetY; j <= height / 2 + offsetY; j += spacingY) {
            mainGrid.addPoint(new Point(new Eclipse.Vector2(i, j), 1, radii, color, isStatic));
        }
    }
}
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
let timeStep = 16.67;
// The desired fps to run at. Does not affect the update timestep
const FPS = 16.67;
// Main physics loop
function startPhysics() {
    // Disable cursor
    if (ConfigObject.uiConfig.cursorDisplay)
        ConfigObject.uiConfig.cursorDisplay.enabled = false;
    timeStep = Eclipse.clamp(timeStep, 0.01667, 16.67);
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
            // Increment time
            time += timeStep;
        }
        drawScene(mainGrid, ctx, mainCam, ConfigObject);
    }, FPS);
}
function stopPhysics() {
    // Enable cursor
    if (ConfigObject.uiConfig.cursorDisplay)
        ConfigObject.uiConfig.cursorDisplay.enabled = true;
    loopPhysics = false;
    resetPoints();
}
// Setup events and loops
controller.mouse.onlmbdown = () => {
    switch (loopPhysics) {
        case false:
            if (controller.keyboard.shiftDown) {
                // Create new static point
                let p = new Point(new Eclipse.Vector2((controller.mouse.x + mainCam.x) / mainCam.zoom, (controller.mouse.y + mainCam.y) / mainCam.zoom), 1, controller.pointPlacementRadius, controller.pointStaticPlacementColor, true);
                if (ConfigObject.generalConfig.allowStaticPointsOnPoints || (!mainGrid.pointOverlapping(p))) {
                    mainGrid.addPoint(p);
                    drawScene(mainGrid, ctx, mainCam, ConfigObject);
                }
            }
            else {
                // Create new dynamic point
                let p = new Point(new Eclipse.Vector2((controller.mouse.x + mainCam.x) / mainCam.zoom, (controller.mouse.y + mainCam.y) / mainCam.zoom), 1, controller.pointPlacementRadius, controller.pointDynamicPlacementColor, false);
                if (ConfigObject.generalConfig.allowDynamicPointsOnPoints || (!mainGrid.pointOverlapping(p))) {
                    mainGrid.addPoint(p);
                    drawScene(mainGrid, ctx, mainCam, ConfigObject);
                }
            }
            break;
    }
};
controller.mouse.onrmbdown = () => {
    var _a, _b, _c;
    switch (loopPhysics) {
        case false:
            const indicies = new Eclipse.Vector2(Math.floor((controller.mouse.x + mainCam.x) / mainCam.zoom / ((_a = mainGrid.cellSize) !== null && _a !== void 0 ? _a : 100)), Math.floor((controller.mouse.y + mainCam.y) / mainCam.zoom / ((_b = mainGrid.cellSize) !== null && _b !== void 0 ? _b : 100)));
            const cell = mainGrid.cells.get(indicies.toString());
            // Cell is undefined if there are no points in it
            if (cell !== undefined) {
                for (let i = 0; i < cell.length; i++) {
                    const p = cell[i];
                    // Do not select the same point twice in a row
                    if (p.identifier === ((_c = controller.selectedPoint) === null || _c === void 0 ? void 0 : _c.identifier))
                        continue;
                    const mouseDistFromP = ((p.x - controller.getGlobalMousePosition().x) * (p.x - controller.getGlobalMousePosition().x)) +
                        ((p.y - controller.getGlobalMousePosition().y) * (p.y - controller.getGlobalMousePosition().y));
                    if (mouseDistFromP <= p.radius * p.radius) {
                        controller.selectedPoint = p;
                        drawScene(mainGrid, ctx, mainCam, ConfigObject);
                        break;
                    }
                }
            }
            else {
                controller.selectedPoint = null;
                drawScene(mainGrid, ctx, mainCam, ConfigObject);
            }
            break;
    }
};
controller.mouse.onscroll = (evt) => {
    controller.pointPlacementRadius += -evt.deltaY / (controller.keyboard.shiftDown ? 10 : 100);
    controller.pointPlacementRadius = Eclipse.clamp(controller.pointPlacementRadius, 1, 10000);
    drawScene(mainGrid, ctx, mainCam, ConfigObject);
};
controller.keyboard.onkeydown = (code) => {
    if (code === 'Space') {
        if (loopPhysics) {
            stopPhysics();
        }
        else {
            startPhysics();
        }
    }
    if (code === 'ShiftLeft' || code === 'ShiftRight') {
        drawScene(mainGrid, ctx, mainCam, ConfigObject);
    }
    if (code === 'Delete') {
        if (controller.selectedPoint !== null) {
            mainGrid.removePoint(controller.selectedPoint.identifier);
            drawScene(mainGrid, ctx, mainCam, ConfigObject);
        }
    }
};
controller.keyboard.onkeyup = (code) => {
    if (code === 'ShiftLeft' || code === 'ShiftRight') {
        drawScene(mainGrid, ctx, mainCam, ConfigObject);
    }
};
controller.keyboard;
drawScene(mainGrid, ctx, mainCam, ConfigObject);
