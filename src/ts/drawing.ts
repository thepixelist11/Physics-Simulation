require('./eclipse')
require('./primitives')
require('./camera')

function drawPoints(points: Array<Point>, ctx: CanvasRenderingContext2D) {
  for (let i = 0; i < points.length; i++) {
    points[i].draw(ctx)
  }
}

function drawScene(points: Array<Point>, ctx: CanvasRenderingContext2D, camera: Camera) {
  ctx.save()
  ctx.translate(camera.x, camera.y)
  ctx.scale(camera.zoom, camera.zoom)
  drawPoints(points, ctx)
  ctx.restore()
}

module.exports = {
  drawScene: drawScene,
}
