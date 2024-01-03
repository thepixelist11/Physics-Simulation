"use strict";
var _a, _b, _c;
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
let canDrawScene = true;
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
        controller.selectedPoint = null;
        drawScene(mainGrid, ctx, mainCam, ConfigObject);
    }
});
ipcRenderer.on('lostFocus', (evt, val) => {
    controller.keyboard.clearKeys();
    windowInFocus = false;
});
ipcRenderer.on('changeGrav', (evt, val) => {
    ipcRenderer.send('disableMenuItem', 'changeGrav');
    const menuHeight = 100;
    const menuBG = document.createElement('div');
    menuBG.classList.add('menuBoxBack');
    menuBG.style.width = `auto`;
    menuBG.style.height = `${menuHeight}px`;
    menuBG.style.top = '50%';
    menuBG.style.left = '50%';
    menuBG.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(menuBG);
    const title = document.createElement('p');
    title.classList.add('menuBoxTitle');
    title.innerHTML = 'Change Acceleration Due To Gravity';
    menuBG.appendChild(title);
    const inputDiv = document.createElement('div');
    menuBG.appendChild(inputDiv);
    const input = document.createElement('input');
    input.type = 'number';
    input.value = gravity.y.toString();
    input.placeholder = gravity.y.toString();
    input.classList.add('menuBoxInput');
    input.title = '';
    inputDiv.appendChild(input);
    const confirm = document.createElement('button');
    confirm.classList.add('menuBoxConfirm');
    confirm.innerHTML = 'OK';
    inputDiv.appendChild(confirm);
    confirm.onclick = () => {
        ipcRenderer.send('enableMenuItem', 'changeGrav');
        gravity.y = parseFloat(input.value);
        document.body.removeChild(menuBG);
    };
    // MenuBG
    // ├───Title
    // └───InputDiv
    //     ├───Input
    //     └───Confirm
});
window.addEventListener('focus', (evt) => {
    windowInFocus = true;
});
// Initialize main camera
let mainCam = new Camera(Eclipse.Vector2.ZERO, 1);
let windowInFocus = true;
// Number of pixels per metre
const pxPerM = 100;
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
            cam: mainCam,
        },
        relativeMousePos: {
            enabled: true,
            position: new Eclipse.Vector2(5, 45),
            color: Eclipse.Color.BLACK,
            cam: mainCam,
        },
        gridIndex: {
            enabled: true,
            position: new Eclipse.Vector2(5, 60),
            color: Eclipse.Color.BLACK,
            cam: mainCam,
        },
        cursorDisplay: {
            enabled: true,
            type: 'pointPlace',
            opacity: 0.5,
            cam: mainCam,
            showWhileMouseInPoint: false,
        },
        entityDisplay: {
            enabled: true,
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
        cursorStyle: 'default',
        gridLineWeight: 2,
        selectionArrows: {
            width: 4,
            lengthAdded: 20,
            xColor: new Eclipse.Color('#33DB15'),
            xHoveredColor: new Eclipse.Color('#228F0E'),
            yColor: new Eclipse.Color('#4868DA'),
            yHoveredColor: new Eclipse.Color('#2E438C'),
            centreColor: new Eclipse.Color('#DBA62B'),
            centreHoveredColor: new Eclipse.Color('#8F6D1D'),
        }
    },
    generalConfig: {
        useSpacialPartitioning: false,
        spacPartCellSize: 500,
        allowDynamicPointsOnPoints: false,
        allowStaticPointsOnPoints: true,
        selectionArrowMouseTolerance: 5
    },
    debugConfig: {
        fillFilledGridCells: false,
    }
};
// Initializes main grid
let mainGrid = new Grid([], 100, [new Wall(1000, 'bottom', Eclipse.Color.FORESTGREEN)]);
mainGrid.cellSize = ConfigObject.generalConfig.spacPartCellSize;
// Initializes main controller
const controller = new Controller(mainGrid, ctx, mainCam, document);
controller.pointPlacementRadius = 20;
controller.pointDynamicPlacementColor = Eclipse.Color.RED;
controller.pointStaticPlacementColor = Eclipse.Color.BLUE;
function generatePointGrid(width, height, radii, color, spacingX, spacingY, offsetX, offsetY, isStatic = true) {
    for (let i = -width / 2 + offsetX; i <= width / 2 + offsetX; i += spacingX) {
        for (let j = -height / 2 + offsetY; j <= height / 2 + offsetY; j += spacingY) {
            mainGrid.addPoint(new Point(new Eclipse.Vector2(i, j), 1, radii, color, isStatic));
        }
    }
}
let showCursor = { uiConfigEnabled: (_c = ConfigObject.uiConfig.cursorDisplay) === null || _c === void 0 ? void 0 : _c.enabled, canPlacePoint: controller.canPlacePoint };
function resetPoints() {
    for (let i = 0; i < mainGrid.points.length; i++) {
        mainGrid.points[i].reset();
    }
    mainGrid.updateCells();
}
// When false will call cancelInterval in main loop
let loopPhysics = false;
let simulationPaused = false;
// Time since simulation started in ms
let time = 0;
// Time in ms to pass per frame. Lower number reduces performance, but increases accuracy. 
// When using basic Stormer-Verlet method, do not lower timestep below 0.01667 as it will cause inaccuracies. 
// Only lower further when using velocity verlet.
let timeStep = 1.667;
// The desired fps to run at. Does not affect the update timestep
const FPS = 16.67;
// Main physics loop
function startPhysics() {
    disableMenuFunctionality();
    controller.canPlacePoint = false;
    controller.selectedPoint = null;
    timeStep = Eclipse.clamp(timeStep, 0.01667, 16.67);
    time = 0;
    loopPhysics = true;
    // Main loop
    const loop = setInterval(() => {
        if (canDrawScene)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < Math.ceil((FPS * 1000) / (timeStep * 1000)); i++) {
            if (!loopPhysics) {
                clearInterval(loop);
                break;
            }
            if (!simulationPaused) {
                updatePoints(timeStep / 1000, mainGrid, pxPerM);
                // Increment time
                time += timeStep;
            }
            // DEBUG --
            // if(mainGrid.points[0].y >= 10000) {
            //   console.log(`Time: ${time / 1000} s, Dist: ${mainGrid.points[0].y / pxPerM} m, Vel: ${mainGrid.points[0].velocity}`)
            //   stopPhysics()
            // }
            // --
        }
        drawScene(mainGrid, ctx, mainCam, ConfigObject);
    }, FPS);
}
function stopPhysics() {
    enableMenuFunctionality();
    loopPhysics = false;
    simulationPaused = false;
    controller.canPlacePoint = true;
    resetPoints();
}
// Setup events and loops
controller.mouse.onlmbdown = () => {
    var _a, _b;
    // Start point drag
    if (controller.selectionArrowHovered !== null && controller.selectedPoint) {
        controller.selectionArrowDragged = true;
        controller.selectionArrowOffsetPos = controller.getGlobalMousePosition().getSub((_a = controller.selectedPoint) === null || _a === void 0 ? void 0 : _a.position);
        controller.selectionArrowAxisDragged = controller.selectionArrowHovered;
    }
    switch (loopPhysics) {
        case false:
            if (controller.canPlacePoint && ((_b = controller.mouse.hoveredElement()) !== null && _b !== void 0 ? _b : new Element()).id === 'mainCanvas') {
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
            }
            break;
    }
};
controller.mouse.onlmbup = () => {
    var _a;
    if (controller.selectionArrowDragged) {
        if (!loopPhysics)
            (_a = controller.selectedPoint) === null || _a === void 0 ? void 0 : _a.setNewInitialValues();
        controller.selectionArrowDragged = false;
        controller.selectionArrowOffsetPos = null;
        controller.selectionArrowAxisDragged = null;
    }
};
controller.mouse.onrmbdown = () => {
    var _a, _b, _c, _d;
    const indicies = new Eclipse.Vector2(Math.floor((controller.mouse.x + mainCam.x) / mainCam.zoom / ((_a = mainGrid.cellSize) !== null && _a !== void 0 ? _a : 100)), Math.floor((controller.mouse.y + mainCam.y) / mainCam.zoom / ((_b = mainGrid.cellSize) !== null && _b !== void 0 ? _b : 100)));
    const cell = mainGrid.cells.get(indicies.toString());
    let mouseInPoint = false;
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
                mouseInPoint = true;
                break;
            }
            else {
                // Deselect
                controller.selectedPoint = null;
                drawScene(mainGrid, ctx, mainCam, ConfigObject);
            }
        }
        if (!mouseInPoint) {
            controller.selectedPoint = null;
            drawScene(mainGrid, ctx, mainCam, ConfigObject);
        }
    }
    else if (ConfigObject.generalConfig.useSpacialPartitioning === false) {
        for (let i = 0; i < mainGrid.points.length; i++) {
            const p = mainGrid.points[i];
            // Do not select the same point twice in a row
            if (p.identifier === ((_d = controller.selectedPoint) === null || _d === void 0 ? void 0 : _d.identifier))
                continue;
            const mouseDistFromP = ((p.x - controller.getGlobalMousePosition().x) * (p.x - controller.getGlobalMousePosition().x)) +
                ((p.y - controller.getGlobalMousePosition().y) * (p.y - controller.getGlobalMousePosition().y));
            if (mouseDistFromP <= p.radius * p.radius) {
                controller.selectedPoint = p;
                drawScene(mainGrid, ctx, mainCam, ConfigObject);
                mouseInPoint = true;
                break;
            }
            else {
                // Deselect
                controller.selectedPoint = null;
                drawScene(mainGrid, ctx, mainCam, ConfigObject);
            }
        }
    }
    else {
        // Deselect
        controller.selectedPoint = null;
        drawScene(mainGrid, ctx, mainCam, ConfigObject);
    }
};
controller.mouse.onscroll = (evt) => {
    controller.pointPlacementRadius += -evt.deltaY / (controller.keyboard.shiftDown ? 10 : 100);
    controller.pointPlacementRadius = Eclipse.clamp(controller.pointPlacementRadius, 1, 10000);
    drawScene(mainGrid, ctx, mainCam, ConfigObject);
};
controller.mouse.onmove = (evt) => {
    drawScene(mainGrid, ctx, mainCam, ConfigObject);
    updateDraggedPointPosition();
};
function updateDraggedPointPosition() {
    updateSelectionArrows();
    if (controller.selectionArrowDragged && controller.selectedPoint && controller.selectionArrowOffsetPos) {
        const previousVelocity = controller.selectedPoint.velocity;
        switch (controller.selectionArrowAxisDragged) {
            case 'x':
                controller.selectedPoint.x = controller.getGlobalMousePosition().x - controller.selectionArrowOffsetPos.x;
                controller.selectedPoint.lastPosition.x = controller.getGlobalMousePosition().x - controller.selectionArrowOffsetPos.x;
                break;
            case 'y':
                controller.selectedPoint.y = controller.getGlobalMousePosition().y - controller.selectionArrowOffsetPos.y;
                controller.selectedPoint.lastPosition.y = controller.getGlobalMousePosition().y - controller.selectionArrowOffsetPos.y;
                break;
            case 'both':
                controller.selectedPoint.x = controller.getGlobalMousePosition().x - controller.selectionArrowOffsetPos.x;
                controller.selectedPoint.y = controller.getGlobalMousePosition().y - controller.selectionArrowOffsetPos.y;
                controller.selectedPoint.lastPosition.x = controller.getGlobalMousePosition().x - controller.selectionArrowOffsetPos.x;
                controller.selectedPoint.lastPosition.y = controller.getGlobalMousePosition().y - controller.selectionArrowOffsetPos.y;
        }
        controller.selectedPoint.velocity = previousVelocity;
        if (loopPhysics)
            controller.selectedPoint.velocity = Eclipse.Vector2.ZERO;
    }
}
controller.keyboard.onkeydown = (code) => {
    var _a, _b;
    if (code === 'Enter' && ((_a = controller.mouse.hoveredElement()) !== null && _a !== void 0 ? _a : new Element()).id === 'mainCanvas') {
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
    if (code === 'Space' && ((_b = controller.mouse.hoveredElement()) !== null && _b !== void 0 ? _b : new Element()).id === 'mainCanvas') {
        if (loopPhysics) {
            // Pause or unpause the simulation
            simulationPaused = !simulationPaused;
        }
    }
};
controller.keyboard.onkeyup = (code) => {
    if (code === 'ShiftLeft' || code === 'ShiftRight') {
        drawScene(mainGrid, ctx, mainCam, ConfigObject);
    }
};
function updateSelectionArrows() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    if (controller.selectionArrowDragged)
        return;
    if (ConfigObject.uiConfig.cursorDisplay)
        ConfigObject.uiConfig.cursorDisplay.enabled = true;
    const p = controller.selectedPoint;
    controller.selectionArrowHovered = null;
    if (ConfigObject.uiConfig.cursorStyle)
        ConfigObject.uiConfig.cursorStyle = 'default';
    updateCursor();
    if (p !== null) {
        const globalMousePos = controller.getGlobalMousePosition();
        // X
        const xBounds = {
            left: p.x + ConfigObject.generalConfig.selectionArrowMouseTolerance,
            right: p.x + p.radius + (((_b = (_a = ConfigObject.uiConfig.selectionArrows) === null || _a === void 0 ? void 0 : _a.lengthAdded) !== null && _b !== void 0 ? _b : 20) / mainCam.zoom) + ConfigObject.generalConfig.selectionArrowMouseTolerance,
            top: p.y - ((_d = (_c = ConfigObject.uiConfig.selectionArrows) === null || _c === void 0 ? void 0 : _c.width) !== null && _d !== void 0 ? _d : 2) - ConfigObject.generalConfig.selectionArrowMouseTolerance,
            bottom: p.y + ((_f = (_e = ConfigObject.uiConfig.selectionArrows) === null || _e === void 0 ? void 0 : _e.width) !== null && _f !== void 0 ? _f : 2) + ConfigObject.generalConfig.selectionArrowMouseTolerance,
        };
        if ((globalMousePos.x <= xBounds.right) &&
            (globalMousePos.x >= xBounds.left) &&
            (globalMousePos.y >= xBounds.top) &&
            (globalMousePos.y <= xBounds.bottom)) {
            if (ConfigObject.uiConfig.cursorStyle)
                ConfigObject.uiConfig.cursorStyle = 'e-resize';
            updateCursor();
            controller.selectionArrowHovered = 'x';
        }
        // Y
        const yBounds = {
            left: p.x - ((_h = (_g = ConfigObject.uiConfig.selectionArrows) === null || _g === void 0 ? void 0 : _g.width) !== null && _h !== void 0 ? _h : 2) - ConfigObject.generalConfig.selectionArrowMouseTolerance,
            right: p.x + ((_k = (_j = ConfigObject.uiConfig.selectionArrows) === null || _j === void 0 ? void 0 : _j.width) !== null && _k !== void 0 ? _k : 2) + ConfigObject.generalConfig.selectionArrowMouseTolerance,
            top: p.y - p.radius - (((_m = (_l = ConfigObject.uiConfig.selectionArrows) === null || _l === void 0 ? void 0 : _l.lengthAdded) !== null && _m !== void 0 ? _m : 20) / mainCam.zoom) - ConfigObject.generalConfig.selectionArrowMouseTolerance,
            bottom: p.y + ConfigObject.generalConfig.selectionArrowMouseTolerance,
        };
        if ((globalMousePos.x <= yBounds.right) &&
            (globalMousePos.x >= yBounds.left) &&
            (globalMousePos.y >= yBounds.top) &&
            (globalMousePos.y <= yBounds.bottom)) {
            if (ConfigObject.uiConfig.cursorStyle)
                ConfigObject.uiConfig.cursorStyle = 's-resize';
            updateCursor();
            controller.selectionArrowHovered = 'y';
        }
        // BOTH
        const dist = (globalMousePos.x - p.x) * (globalMousePos.x - p.x) + (globalMousePos.y - p.y) * (globalMousePos.y - p.y);
        if (dist <= Math.pow((((_p = (_o = ConfigObject.uiConfig.selectionArrows) === null || _o === void 0 ? void 0 : _o.width) !== null && _p !== void 0 ? _p : 2) * 1.5 + ConfigObject.generalConfig.selectionArrowMouseTolerance), 2)) {
            if (ConfigObject.uiConfig.cursorStyle)
                ConfigObject.uiConfig.cursorStyle = 'move';
            updateCursor();
            controller.selectionArrowHovered = 'both';
        }
    }
}
function updateCursor() {
    var _a;
    canvas.style.cursor = (_a = ConfigObject.uiConfig.cursorStyle) !== null && _a !== void 0 ? _a : 'default';
}
function mouseInAnyPoint() {
    for (let i = 0; i < mainGrid.points.length; i++) {
        const p = mainGrid.points[i];
        const globalMousePos = controller.getGlobalMousePosition();
        const dist = ((globalMousePos.x - p.x) * (globalMousePos.x - p.x)) + ((globalMousePos.y - p.y) * (globalMousePos.y - p.y));
        if (dist <= p.radius * p.radius) {
            return true;
        }
    }
    return false;
}
function disableMenuFunctionality() {
    ipcRenderer.send('disableMenuItem', 'saveSim');
    ipcRenderer.send('disableMenuItem', 'loadSim');
    ipcRenderer.send('disableMenuItem', 'clearAll');
}
function enableMenuFunctionality() {
    ipcRenderer.send('enableMenuItem', 'saveSim');
    ipcRenderer.send('enableMenuItem', 'loadSim');
    ipcRenderer.send('enableMenuItem', 'clearAll');
}
drawScene(mainGrid, ctx, mainCam, ConfigObject);
