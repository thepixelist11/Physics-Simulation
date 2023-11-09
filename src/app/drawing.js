"use strict";
require('./eclipse');
require('./primitives');
require('./camera');
function drawPoints(points, ctx) {
    for (let i = 0; i < points.length; i++) {
        points[i].draw(ctx);
    }
}
function drawScene(grid, ctx, camera, bgColor = Eclipse.Color.WHITE) {
    drawBackground(ctx, bgColor);
    ctx.save();
    ctx.translate(-camera.x, -camera.y);
    ctx.scale(camera.zoom, camera.zoom);
    // TODO: Allow toggling on and off grid lines on top
    drawGrid(grid, ctx, camera);
    drawPoints(grid.points, ctx);
    ctx.restore();
    // Draw UI overlay
    // TODO: Add overlay config file
    drawOverlay(ctx, {
        cameraPos: {
            enabled: true,
            position: new Eclipse.Vector2(5, 15),
            color: Eclipse.Color.BLACK,
            cam: camera,
        }
    });
}
function drawGrid(grid, ctx, camera) {
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
    // Vertical Grid Lines
    for (let i = Math.floor(left / grid.cellSize); i <= Math.floor(right / grid.cellSize); i++) {
        Eclipse.drawLine(ctx, new Eclipse.Vector2(i * grid.cellSize, top), new Eclipse.Vector2(i * grid.cellSize, bottom), 5 * camera.zoom, Eclipse.Color.LIGHTGREY);
    }
    // Horizontal Grid Lines
    for (let i = Math.floor(top / grid.cellSize); i <= Math.floor(bottom / grid.cellSize); i++) {
        Eclipse.drawLine(ctx, new Eclipse.Vector2(left, i * grid.cellSize), new Eclipse.Vector2(right, i * grid.cellSize), 5 * camera.zoom, Eclipse.Color.LIGHTGREY);
    }
}
function drawBackground(ctx, color) {
    ctx.fillStyle = color.toString();
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
function drawOverlay(ctx, options) {
    var _a;
    if (options.cameraPos && options.cameraPos.enabled) {
        ctx.font = (_a = options.cameraPos.fontStyle) !== null && _a !== void 0 ? _a : 'courier 100px';
        ctx.fillStyle = options.cameraPos.color.toString();
        ctx.fillText(`CamX: ${options.cameraPos.cam.x}, CamY: ${options.cameraPos.cam.y}`, options.cameraPos.position.x, options.cameraPos.position.y);
    }
}
module.exports = {
    drawScene: drawScene,
};
