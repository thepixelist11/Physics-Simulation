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
module.exports = {
    drawScene: drawScene,
};
