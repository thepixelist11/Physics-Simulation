"use strict";
require('./eclipse');
require('./primitives');
require('./camera');
function drawPoints(points, ctx) {
    for (let i = 0; i < points.length; i++) {
        points[i].draw(ctx);
    }
}
function drawScene(points, ctx, camera) {
    ctx.save();
    ctx.translate(camera.x, camera.y);
    ctx.scale(camera.zoom, camera.zoom);
    drawPoints(points, ctx);
    ctx.restore();
}
module.exports = {
    drawScene: drawScene,
};
