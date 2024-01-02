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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14;
    // Mouse Cursor
    if (options.cursorDisplay &&
        options.cursorDisplay.enabled &&
        controller.canPlacePoint &&
        controller.selectionArrowHovered === null &&
        !controller.selectionArrowDragged) {
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
    drawPointArrows(mainGrid.points, ctx, ((_b = (_a = options.selectionArrows) === null || _a === void 0 ? void 0 : _a.lengthAdded) !== null && _b !== void 0 ? _b : 20) / mainCam.zoom, ((_d = (_c = options.selectionArrows) === null || _c === void 0 ? void 0 : _c.width) !== null && _d !== void 0 ? _d : 2) / mainCam.zoom, ((_f = (_e = options.selectionArrows) === null || _e === void 0 ? void 0 : _e.xColor) !== null && _f !== void 0 ? _f : Eclipse.Color.GREEN), ((_h = (_g = options.selectionArrows) === null || _g === void 0 ? void 0 : _g.yColor) !== null && _h !== void 0 ? _h : Eclipse.Color.BLUE), ((_k = (_j = options.selectionArrows) === null || _j === void 0 ? void 0 : _j.centreColor) !== null && _k !== void 0 ? _k : Eclipse.Color.YELLOW), ((_m = (_l = options.selectionArrows) === null || _l === void 0 ? void 0 : _l.xHoveredColor) !== null && _m !== void 0 ? _m : Eclipse.Color.FORESTGREEN), ((_p = (_o = options.selectionArrows) === null || _o === void 0 ? void 0 : _o.yHoveredColor) !== null && _p !== void 0 ? _p : Eclipse.Color.MIDNIGHTBLUE), ((_r = (_q = options.selectionArrows) === null || _q === void 0 ? void 0 : _q.centreHoveredColor) !== null && _r !== void 0 ? _r : Eclipse.Color.GOLD));
    ctx.restore();
    // Camera Position
    if (options.cameraPos && options.cameraPos.enabled) {
        ctx.font = (_s = options.cameraPos.fontStyle) !== null && _s !== void 0 ? _s : 'courier 100px';
        ctx.fillStyle = options.cameraPos.color.toString();
        let text = '';
        if ((_t = options.cameraPos.camX) !== null && _t !== void 0 ? _t : true)
            text = text.concat(`CamX: ${options.cameraPos.cam.x} `);
        if ((_u = options.cameraPos.camY) !== null && _u !== void 0 ? _u : true)
            text = text.concat(`CamY: ${options.cameraPos.cam.y} `);
        if ((_v = options.cameraPos.camZoom) !== null && _v !== void 0 ? _v : true)
            text = text.concat(`CamZoom: ${options.cameraPos.cam.zoom.toFixed(4)} `);
        ctx.fillText(text, options.cameraPos.position.x, options.cameraPos.position.y);
    }
    // Global Mouse Position
    if (options.globalMousePos && options.globalMousePos.enabled) {
        ctx.font = (_w = options.globalMousePos.fontStyle) !== null && _w !== void 0 ? _w : 'courier 100px';
        ctx.fillStyle = options.globalMousePos.color.toString();
        if (controller.mouse !== null) {
            let text = '';
            if ((_x = options.globalMousePos.showX) !== null && _x !== void 0 ? _x : true)
                text = text.concat(`globalMouseX: ${Math.round(controller.getGlobalMousePosition().x)} `);
            if ((_y = options.globalMousePos.showY) !== null && _y !== void 0 ? _y : true)
                text = text.concat(`globalMouseY: ${Math.round(controller.getGlobalMousePosition().y)} `);
            ctx.fillText(text, options.globalMousePos.position.x, options.globalMousePos.position.y);
        }
        else {
            ctx.fillText(`Failed to get mouse`, options.globalMousePos.position.x, options.globalMousePos.position.y);
        }
    }
    // Relative Mouse Position
    if (options.relativeMousePos && options.relativeMousePos.enabled) {
        ctx.font = (_z = options.relativeMousePos.fontStyle) !== null && _z !== void 0 ? _z : 'courier 100px';
        ctx.fillStyle = options.relativeMousePos.color.toString();
        if (controller.mouse !== null) {
            let text = '';
            if ((_0 = options.relativeMousePos.showX) !== null && _0 !== void 0 ? _0 : true)
                text = text.concat(`mouseX: ${Math.round((controller.mouse.x) / options.relativeMousePos.cam.zoom)} `);
            if ((_1 = options.relativeMousePos.showY) !== null && _1 !== void 0 ? _1 : true)
                text = text.concat(`mouseY: ${Math.round((controller.mouse.y) / options.relativeMousePos.cam.zoom)} `);
            ctx.fillText(text, options.relativeMousePos.position.x, options.relativeMousePos.position.y);
        }
        else {
            ctx.fillText(`Failed to get mouse`, options.relativeMousePos.position.x, options.relativeMousePos.position.y);
        }
    }
    // Visual Grid Index
    if (options.gridIndex && options.gridIndex.enabled) {
        ctx.font = (_2 = options.gridIndex.fontStyle) !== null && _2 !== void 0 ? _2 : 'courier 100px';
        ctx.fillStyle = options.gridIndex.color.toString();
        if (controller.mouse !== null) {
            let text = '';
            if ((_3 = options.gridIndex.showX) !== null && _3 !== void 0 ? _3 : true)
                text = text.concat(`gridX: ${Math.floor((controller.mouse.x + mainCam.x) / options.gridIndex.cam.zoom / ((_4 = ConfigObject.uiConfig.cellSize) !== null && _4 !== void 0 ? _4 : 100))} `);
            if ((_5 = options.gridIndex.showY) !== null && _5 !== void 0 ? _5 : true)
                text = text.concat(`gridY: ${Math.floor((controller.mouse.y + mainCam.y) / options.gridIndex.cam.zoom / ((_6 = ConfigObject.uiConfig.cellSize) !== null && _6 !== void 0 ? _6 : 100))} `);
            ctx.fillText(text, options.gridIndex.position.x, options.gridIndex.position.y);
        }
        else {
            ctx.fillText(`Failed to get mouse`, options.gridIndex.position.x, options.gridIndex.position.y);
        }
    }
    // Entity Display
    if (options.entityDisplay && options.entityDisplay.enabled) {
        ctx.font = (_7 = options.entityDisplay.fontStyle) !== null && _7 !== void 0 ? _7 : 'courier 100px';
        let textX = parseInt(JSON.parse(JSON.stringify(options.entityDisplay.position.x)));
        if ((_8 = options.entityDisplay.showTotal) !== null && _8 !== void 0 ? _8 : true) {
            ctx.fillStyle = options.entityDisplay.totalColor.toString();
            let text = `Total Entities: ${mainGrid.points.length} `;
            ctx.fillText(text, textX, options.entityDisplay.position.y);
            textX += ctx.measureText(text).width + ((_9 = options.entityDisplay.spacingBetweenTotals) !== null && _9 !== void 0 ? _9 : 0);
        }
        if ((_10 = options.entityDisplay.showDynamic) !== null && _10 !== void 0 ? _10 : true) {
            ctx.fillStyle = options.entityDisplay.dynamicColor.toString();
            let text = `Dynamic Entities: ${mainGrid.totalDynamic} `;
            ctx.fillText(text, textX, options.entityDisplay.position.y);
            textX += ctx.measureText(text).width + ((_11 = options.entityDisplay.spacingBetweenTotals) !== null && _11 !== void 0 ? _11 : 0);
        }
        if ((_12 = options.entityDisplay.showStatic) !== null && _12 !== void 0 ? _12 : true) {
            ctx.fillStyle = options.entityDisplay.staticColor.toString();
            let text = `Static Entities: ${mainGrid.totalStatic} `;
            ctx.fillText(text, textX, options.entityDisplay.position.y);
        }
    }
    // Selected Identifier
    if (options.selectedIdentifier && options.selectedIdentifier.enabled) {
        ctx.font = (_13 = options.selectedIdentifier.fontStyle) !== null && _13 !== void 0 ? _13 : 'courier 100px';
        ctx.fillStyle = options.selectedIdentifier.color.toString();
        let text = (_14 = controller.selectedPoint) === null || _14 === void 0 ? void 0 : _14.identifier.toString();
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
module.exports = {
    drawScene: drawScene,
    drawOverlay: drawOverlay,
};
