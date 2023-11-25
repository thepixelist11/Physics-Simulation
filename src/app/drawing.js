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
    // TODO: Allow toggling on and off grid lines on top
    drawGrid(grid, ctx, camera, ConfigObject);
    drawPoints(grid.points, ctx);
    ctx.restore();
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
            Eclipse.drawLine(ctx, new Eclipse.Vector2(i * ((_d = ConfigObject.uiConfig.cellSize) !== null && _d !== void 0 ? _d : 100), top), new Eclipse.Vector2(i * ((_e = ConfigObject.uiConfig.cellSize) !== null && _e !== void 0 ? _e : 100), bottom), 5 * camera.zoom, Eclipse.Color.LIGHTGREY);
        }
        // Horizontal Grid Lines
        for (let i = Math.floor(top / ((_f = ConfigObject.uiConfig.cellSize) !== null && _f !== void 0 ? _f : 100)); i <= Math.floor(bottom / ((_g = ConfigObject.uiConfig.cellSize) !== null && _g !== void 0 ? _g : 100)); i++) {
            Eclipse.drawLine(ctx, new Eclipse.Vector2(left, i * ((_h = ConfigObject.uiConfig.cellSize) !== null && _h !== void 0 ? _h : 100)), new Eclipse.Vector2(right, i * ((_j = ConfigObject.uiConfig.cellSize) !== null && _j !== void 0 ? _j : 100)), 5 * camera.zoom, Eclipse.Color.LIGHTGREY);
        }
    }
}
function drawBackground(ctx, color) {
    ctx.fillStyle = color.toString();
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
function drawOverlay(ctx, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    // Camera Position
    if (options.cameraPos && options.cameraPos.enabled) {
        ctx.font = (_a = options.cameraPos.fontStyle) !== null && _a !== void 0 ? _a : 'courier 100px';
        ctx.fillStyle = options.cameraPos.color.toString();
        let text = '';
        if ((_b = options.cameraPos.camX) !== null && _b !== void 0 ? _b : true)
            text = text.concat(`CamX: ${options.cameraPos.cam.x} `);
        if ((_c = options.cameraPos.camY) !== null && _c !== void 0 ? _c : true)
            text = text.concat(`CamY: ${options.cameraPos.cam.y} `);
        if ((_d = options.cameraPos.camZoom) !== null && _d !== void 0 ? _d : true)
            text = text.concat(`CamZoom: ${options.cameraPos.cam.zoom} `);
        ctx.fillText(text, options.cameraPos.position.x, options.cameraPos.position.y);
    }
    // Global Mouse Position
    if (options.globalMousePos && options.globalMousePos.enabled) {
        ctx.font = (_e = options.globalMousePos.fontStyle) !== null && _e !== void 0 ? _e : 'courier 100px';
        ctx.fillStyle = options.globalMousePos.color.toString();
        if (options.globalMousePos.mouse !== null) {
            let text = '';
            if ((_f = options.globalMousePos.showX) !== null && _f !== void 0 ? _f : true)
                text = text.concat(`globalMouseX: ${Math.round((options.globalMousePos.mouse.x + mainCam.x) / options.globalMousePos.cam.zoom)} `);
            if ((_g = options.globalMousePos.showY) !== null && _g !== void 0 ? _g : true)
                text = text.concat(`globalMouseY: ${Math.round((options.globalMousePos.mouse.y + mainCam.y) / options.globalMousePos.cam.zoom)} `);
            ctx.fillText(text, options.globalMousePos.position.x, options.globalMousePos.position.y);
        }
        else {
            ctx.fillText(`Failed to get mouse`, options.globalMousePos.position.x, options.globalMousePos.position.y);
        }
    }
    // Relative Mouse Position
    if (options.relativeMousePos && options.relativeMousePos.enabled) {
        ctx.font = (_h = options.relativeMousePos.fontStyle) !== null && _h !== void 0 ? _h : 'courier 100px';
        ctx.fillStyle = options.relativeMousePos.color.toString();
        if (options.relativeMousePos.mouse !== null) {
            let text = '';
            if ((_j = options.relativeMousePos.showX) !== null && _j !== void 0 ? _j : true)
                text = text.concat(`mouseX: ${Math.round((options.relativeMousePos.mouse.x) / options.relativeMousePos.cam.zoom)} `);
            if ((_k = options.relativeMousePos.showY) !== null && _k !== void 0 ? _k : true)
                text = text.concat(`mouseY: ${Math.round((options.relativeMousePos.mouse.y) / options.relativeMousePos.cam.zoom)} `);
            ctx.fillText(text, options.relativeMousePos.position.x, options.relativeMousePos.position.y);
        }
        else {
            ctx.fillText(`Failed to get mouse`, options.relativeMousePos.position.x, options.relativeMousePos.position.y);
        }
    }
    // Grid Index
    if (options.gridIndex && options.gridIndex.enabled) {
        ctx.font = (_l = options.gridIndex.fontStyle) !== null && _l !== void 0 ? _l : 'courier 100px';
        ctx.fillStyle = options.gridIndex.color.toString();
        if (options.gridIndex.mouse !== null) {
            let text = '';
            if ((_m = options.gridIndex.showX) !== null && _m !== void 0 ? _m : true)
                text = text.concat(`gridX: ${Math.floor((options.gridIndex.mouse.x + mainCam.x) / options.gridIndex.cam.zoom / ((_o = ConfigObject.uiConfig.cellSize) !== null && _o !== void 0 ? _o : 100))} `);
            if ((_p = options.gridIndex.showY) !== null && _p !== void 0 ? _p : true)
                text = text.concat(`gridY: ${Math.floor((options.gridIndex.mouse.y + mainCam.y) / options.gridIndex.cam.zoom / ((_q = ConfigObject.uiConfig.cellSize) !== null && _q !== void 0 ? _q : 100))} `);
            ctx.fillText(text, options.gridIndex.position.x, options.gridIndex.position.y);
        }
        else {
            ctx.fillText(`Failed to get mouse`, options.gridIndex.position.x, options.gridIndex.position.y);
        }
    }
    // Mouse Cursor
    if (options.cursorDisplay && options.cursorDisplay.enabled) {
        switch (options.cursorDisplay.type) {
            case 'pointPlace':
                ctx.globalAlpha = options.cursorDisplay.opacity;
                options.cursorDisplay.controller.mouse.x;
                options.cursorDisplay.controller.mouse.y;
                Eclipse.drawPoint(ctx, options.cursorDisplay.controller.mouse.x, options.cursorDisplay.controller.mouse.y, options.cursorDisplay.controller.pointPlacementRadius
                    * options.cursorDisplay.cam.zoom, options.cursorDisplay.controller.pointDynamicPlacementColor);
                ctx.globalAlpha = 1;
                break;
        }
    }
    // Entity Display
    if (options.entityDisplay && options.entityDisplay.enabled) {
        ctx.font = (_r = options.entityDisplay.fontStyle) !== null && _r !== void 0 ? _r : 'courier 100px';
        let textX = parseInt(JSON.parse(JSON.stringify(options.entityDisplay.position.x)));
        if ((_s = options.entityDisplay.showTotal) !== null && _s !== void 0 ? _s : true) {
            ctx.fillStyle = options.entityDisplay.totalColor.toString();
            let text = `Total Entities: ${options.entityDisplay.grid.points.length} `;
            ctx.fillText(text, textX, options.entityDisplay.position.y);
            textX += ctx.measureText(text).width + ((_t = options.entityDisplay.spacingBetweenTotals) !== null && _t !== void 0 ? _t : 0);
        }
        if ((_u = options.entityDisplay.showDynamic) !== null && _u !== void 0 ? _u : true) {
            ctx.fillStyle = options.entityDisplay.dynamicColor.toString();
            let text = `Dynamic Entities: ${options.entityDisplay.grid.totalDynamic} `;
            ctx.fillText(text, textX, options.entityDisplay.position.y);
            textX += ctx.measureText(text).width + ((_v = options.entityDisplay.spacingBetweenTotals) !== null && _v !== void 0 ? _v : 0);
        }
        if ((_w = options.entityDisplay.showStatic) !== null && _w !== void 0 ? _w : true) {
            ctx.fillStyle = options.entityDisplay.staticColor.toString();
            let text = `Static Entities: ${options.entityDisplay.grid.totalStatic} `;
            ctx.fillText(text, textX, options.entityDisplay.position.y);
        }
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
