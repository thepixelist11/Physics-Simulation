"use strict";
require('./eclipse');
require('./primitives');
require('./camera');
require('./controller');
function drawPoints(points, ctx) {
    for (let i = 0; i < points.length; i++) {
        points[i].draw(ctx);
    }
}
function drawPointArrows(points, ctx, arrowSize, arrowWidth, xColor, yColor, centreColor, xHoveredColor, yHoveredColor, centreHoveredColor) {
    var _a;
    for (let i = 0; i < points.length; i++) {
        if (!canDrawScene)
            break;
        if (points[i].identifier === ((_a = controller.selectedPoint) === null || _a === void 0 ? void 0 : _a.identifier)) {
            points[i].drawMovementArrows(arrowSize, arrowWidth, xColor, yColor, centreColor, xHoveredColor, yHoveredColor, centreHoveredColor);
        }
    }
}
function drawScene(grid, ctx, camera, ConfigObject, bgColor = Eclipse.Color.WHITE) {
    var _a;
    drawBackground(ctx, bgColor);
    ctx.save();
    ctx.translate(-camera.x, -camera.y);
    ctx.scale(camera.zoom, camera.zoom);
    // Debug -
    if ((_a = ConfigObject.debugConfig.fillFilledGridCells) !== null && _a !== void 0 ? _a : false) {
        fillNonEmptyGridCells(ctx, grid, Eclipse.Color.SILVER);
    }
    // -
    drawGrid(grid, ctx, camera, ConfigObject);
    drawPoints(grid.points, ctx);
    ctx.restore();
    drawWalls();
    drawOverlay(ctx, ConfigObject.uiConfig);
}
function drawGrid(grid, ctx, camera, ConfigObject) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const canvas = ctx.canvas;
    let { left, right, top, bottom } = canvas.getBoundingClientRect();
    // Scale grid based on camera
    right += camera.x;
    left += camera.x;
    top += camera.y;
    bottom += camera.y;
    right *= 1 / camera.zoom;
    left *= 1 / camera.zoom;
    top *= 1 / camera.zoom;
    bottom *= 1 / camera.zoom;
    if ((_a = ConfigObject.uiConfig.drawGridLines) !== null && _a !== void 0 ? _a : true) {
        // Vertical Grid Lines
        for (let i = Math.floor(left / ((_b = ConfigObject.uiConfig.cellSize) !== null && _b !== void 0 ? _b : 100)); i <= Math.floor(right / ((_c = ConfigObject.uiConfig.cellSize) !== null && _c !== void 0 ? _c : 100)); i++) {
            Eclipse.drawLine(ctx, new Eclipse.Vector2(i * ((_d = ConfigObject.uiConfig.cellSize) !== null && _d !== void 0 ? _d : 100), top), new Eclipse.Vector2(i * ((_e = ConfigObject.uiConfig.cellSize) !== null && _e !== void 0 ? _e : 100), bottom), ConfigObject.uiConfig.gridLineWeight, Eclipse.Color.LIGHTGREY);
        }
        // Horizontal Grid Lines
        for (let i = Math.floor(top / ((_f = ConfigObject.uiConfig.cellSize) !== null && _f !== void 0 ? _f : 100)); i <= Math.floor(bottom / ((_g = ConfigObject.uiConfig.cellSize) !== null && _g !== void 0 ? _g : 100)); i++) {
            Eclipse.drawLine(ctx, new Eclipse.Vector2(left, i * ((_h = ConfigObject.uiConfig.cellSize) !== null && _h !== void 0 ? _h : 100)), new Eclipse.Vector2(right, i * ((_j = ConfigObject.uiConfig.cellSize) !== null && _j !== void 0 ? _j : 100)), ConfigObject.uiConfig.gridLineWeight, Eclipse.Color.LIGHTGREY);
        }
    }
}
function drawWalls() {
    for (let i = 0; i < mainGrid.walls.length; i++) {
        const w = mainGrid.walls[i];
        w.draw();
    }
}
function drawBackground(ctx, color) {
    ctx.fillStyle = color.toString();
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
function drawOverlay(ctx, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15;
    // Mouse Cursor
    if (options.cursorDisplay &&
        options.cursorDisplay.enabled &&
        controller.canPlacePoint &&
        controller.selectionArrowHovered === null &&
        !controller.selectionArrowDragged &&
        ((_a = controller.mouse.hoveredElement()) !== null && _a !== void 0 ? _a : new Element()).id === 'mainCanvas') {
        switch (options.cursorDisplay.type) {
            case 'pointPlace':
                ctx.globalAlpha = options.cursorDisplay.opacity;
                controller.mouse.x;
                controller.mouse.y;
                Eclipse.drawPoint(ctx, controller.mouse.x, controller.mouse.y, controller.pointPlacementRadius
                    * options.cursorDisplay.cam.zoom, controller.keyboard.shiftDown ?
                    controller.pointStaticPlacementColor :
                    controller.pointDynamicPlacementColor);
                ctx.globalAlpha = 1;
                break;
        }
    }
    ctx.save();
    ctx.translate(-mainCam.x, -mainCam.y);
    ctx.scale(mainCam.zoom, mainCam.zoom);
    drawPointArrows(mainGrid.points, ctx, ((_c = (_b = options.selectionArrows) === null || _b === void 0 ? void 0 : _b.lengthAdded) !== null && _c !== void 0 ? _c : 20) / mainCam.zoom, ((_e = (_d = options.selectionArrows) === null || _d === void 0 ? void 0 : _d.width) !== null && _e !== void 0 ? _e : 2) / mainCam.zoom, ((_g = (_f = options.selectionArrows) === null || _f === void 0 ? void 0 : _f.xColor) !== null && _g !== void 0 ? _g : Eclipse.Color.GREEN), ((_j = (_h = options.selectionArrows) === null || _h === void 0 ? void 0 : _h.yColor) !== null && _j !== void 0 ? _j : Eclipse.Color.BLUE), ((_l = (_k = options.selectionArrows) === null || _k === void 0 ? void 0 : _k.centreColor) !== null && _l !== void 0 ? _l : Eclipse.Color.YELLOW), ((_o = (_m = options.selectionArrows) === null || _m === void 0 ? void 0 : _m.xHoveredColor) !== null && _o !== void 0 ? _o : Eclipse.Color.FORESTGREEN), ((_q = (_p = options.selectionArrows) === null || _p === void 0 ? void 0 : _p.yHoveredColor) !== null && _q !== void 0 ? _q : Eclipse.Color.MIDNIGHTBLUE), ((_s = (_r = options.selectionArrows) === null || _r === void 0 ? void 0 : _r.centreHoveredColor) !== null && _s !== void 0 ? _s : Eclipse.Color.GOLD));
    ctx.restore();
    // Camera Position
    if (options.cameraPos && options.cameraPos.enabled) {
        ctx.font = (_t = options.cameraPos.fontStyle) !== null && _t !== void 0 ? _t : 'courier 100px';
        ctx.fillStyle = options.cameraPos.color.toString();
        let text = '';
        if ((_u = options.cameraPos.camX) !== null && _u !== void 0 ? _u : true)
            text = text.concat(`CamX: ${options.cameraPos.cam.x} `);
        if ((_v = options.cameraPos.camY) !== null && _v !== void 0 ? _v : true)
            text = text.concat(`CamY: ${options.cameraPos.cam.y} `);
        if ((_w = options.cameraPos.camZoom) !== null && _w !== void 0 ? _w : true)
            text = text.concat(`CamZoom: ${options.cameraPos.cam.zoom.toFixed(4)} `);
        ctx.fillText(text, options.cameraPos.position.x, options.cameraPos.position.y);
    }
    // Global Mouse Position
    if (options.globalMousePos && options.globalMousePos.enabled) {
        ctx.font = (_x = options.globalMousePos.fontStyle) !== null && _x !== void 0 ? _x : 'courier 100px';
        ctx.fillStyle = options.globalMousePos.color.toString();
        if (controller.mouse !== null) {
            let text = '';
            if ((_y = options.globalMousePos.showX) !== null && _y !== void 0 ? _y : true)
                text = text.concat(`globalMouseX: ${Math.round(controller.getGlobalMousePosition().x)} `);
            if ((_z = options.globalMousePos.showY) !== null && _z !== void 0 ? _z : true)
                text = text.concat(`globalMouseY: ${Math.round(controller.getGlobalMousePosition().y)} `);
            ctx.fillText(text, options.globalMousePos.position.x, options.globalMousePos.position.y);
        }
        else {
            ctx.fillText(`Failed to get mouse`, options.globalMousePos.position.x, options.globalMousePos.position.y);
        }
    }
    // Relative Mouse Position
    if (options.relativeMousePos && options.relativeMousePos.enabled) {
        ctx.font = (_0 = options.relativeMousePos.fontStyle) !== null && _0 !== void 0 ? _0 : 'courier 100px';
        ctx.fillStyle = options.relativeMousePos.color.toString();
        if (controller.mouse !== null) {
            let text = '';
            if ((_1 = options.relativeMousePos.showX) !== null && _1 !== void 0 ? _1 : true)
                text = text.concat(`mouseX: ${Math.round((controller.mouse.x) / options.relativeMousePos.cam.zoom)} `);
            if ((_2 = options.relativeMousePos.showY) !== null && _2 !== void 0 ? _2 : true)
                text = text.concat(`mouseY: ${Math.round((controller.mouse.y) / options.relativeMousePos.cam.zoom)} `);
            ctx.fillText(text, options.relativeMousePos.position.x, options.relativeMousePos.position.y);
        }
        else {
            ctx.fillText(`Failed to get mouse`, options.relativeMousePos.position.x, options.relativeMousePos.position.y);
        }
    }
    // Visual Grid Index
    if (options.gridIndex && options.gridIndex.enabled) {
        ctx.font = (_3 = options.gridIndex.fontStyle) !== null && _3 !== void 0 ? _3 : 'courier 100px';
        ctx.fillStyle = options.gridIndex.color.toString();
        if (controller.mouse !== null) {
            let text = '';
            if ((_4 = options.gridIndex.showX) !== null && _4 !== void 0 ? _4 : true)
                text = text.concat(`gridX: ${Math.floor((controller.mouse.x + mainCam.x) / options.gridIndex.cam.zoom / ((_5 = ConfigObject.uiConfig.cellSize) !== null && _5 !== void 0 ? _5 : 100))} `);
            if ((_6 = options.gridIndex.showY) !== null && _6 !== void 0 ? _6 : true)
                text = text.concat(`gridY: ${Math.floor((controller.mouse.y + mainCam.y) / options.gridIndex.cam.zoom / ((_7 = ConfigObject.uiConfig.cellSize) !== null && _7 !== void 0 ? _7 : 100))} `);
            ctx.fillText(text, options.gridIndex.position.x, options.gridIndex.position.y);
        }
        else {
            ctx.fillText(`Failed to get mouse`, options.gridIndex.position.x, options.gridIndex.position.y);
        }
    }
    // Entity Display
    if (options.entityDisplay && options.entityDisplay.enabled) {
        ctx.font = (_8 = options.entityDisplay.fontStyle) !== null && _8 !== void 0 ? _8 : 'courier 100px';
        let textX = parseInt(JSON.parse(JSON.stringify(options.entityDisplay.position.x)));
        if ((_9 = options.entityDisplay.showTotal) !== null && _9 !== void 0 ? _9 : true) {
            ctx.fillStyle = options.entityDisplay.totalColor.toString();
            let text = `Total Entities: ${mainGrid.points.length} `;
            ctx.fillText(text, textX, options.entityDisplay.position.y);
            textX += ctx.measureText(text).width + ((_10 = options.entityDisplay.spacingBetweenTotals) !== null && _10 !== void 0 ? _10 : 0);
        }
        if ((_11 = options.entityDisplay.showDynamic) !== null && _11 !== void 0 ? _11 : true) {
            ctx.fillStyle = options.entityDisplay.dynamicColor.toString();
            let text = `Dynamic Entities: ${mainGrid.totalDynamic} `;
            ctx.fillText(text, textX, options.entityDisplay.position.y);
            textX += ctx.measureText(text).width + ((_12 = options.entityDisplay.spacingBetweenTotals) !== null && _12 !== void 0 ? _12 : 0);
        }
        if ((_13 = options.entityDisplay.showStatic) !== null && _13 !== void 0 ? _13 : true) {
            ctx.fillStyle = options.entityDisplay.staticColor.toString();
            let text = `Static Entities: ${mainGrid.totalStatic} `;
            ctx.fillText(text, textX, options.entityDisplay.position.y);
        }
    }
    // Selected Identifier
    if (options.selectedIdentifier && options.selectedIdentifier.enabled) {
        ctx.font = (_14 = options.selectedIdentifier.fontStyle) !== null && _14 !== void 0 ? _14 : 'courier 100px';
        ctx.fillStyle = options.selectedIdentifier.color.toString();
        let text = (_15 = controller.selectedPoint) === null || _15 === void 0 ? void 0 : _15.identifier.toString();
        ctx.fillText(`Selected Point ID: ${text !== null && text !== void 0 ? text : 'None'}`, options.selectedIdentifier.position.x, options.selectedIdentifier.position.y);
    }
}
function fillNonEmptyGridCells(ctx, grid, color) {
    for (const cell of grid.cells) {
        const pos = Eclipse.Vector2.create(cell[0]);
        ctx.fillStyle = color.toString();
        ctx.fillRect(pos.x * grid.cellSize, pos.y * grid.cellSize, grid.cellSize, grid.cellSize);
    }
}
