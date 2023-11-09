require('./eclipse')
require('./primitives')
require('./camera')

function drawPoints(points: Array<Point>, ctx: CanvasRenderingContext2D) {
  for (let i = 0; i < points.length; i++) {
    points[i].draw(ctx)
  }
}

function drawScene(grid: Grid, ctx: CanvasRenderingContext2D, camera: Camera, bgColor = Eclipse.Color.WHITE) {
  drawBackground(ctx, bgColor)
  ctx.save()
  ctx.translate(camera.x, camera.y)
  ctx.scale(camera.zoom, camera.zoom)
  // TODO: Allow toggling on and off grid lines on top
  drawGrid(grid, ctx, camera)
  drawPoints(grid.points, ctx)
  ctx.restore()
}

function drawGrid(grid: Grid, ctx: CanvasRenderingContext2D, camera: Camera) {
  const canvas = ctx.canvas
  let { left, right, top, bottom } = canvas.getBoundingClientRect()
  right *= 1 / camera.zoom
  left *= 1 / camera.zoom
  top *= 1 / camera.zoom
  bottom *= 1 / camera.zoom
  // Vertical Grid Lines
  for(let i = 0; i <= Math.floor(right / grid.cellSize); i++) {
    Eclipse.drawLine(ctx, new Eclipse.Vector2(i * grid.cellSize, top), new Eclipse.Vector2(i * grid.cellSize, bottom), 5 * camera.zoom, Eclipse.Color.LIGHTGREY)
  }
  // Horizontal Grid Lines
  for(let i = 0; i <= Math.floor(bottom / grid.cellSize); i++) {
    Eclipse.drawLine(ctx, new Eclipse.Vector2(left, i * grid.cellSize), new Eclipse.Vector2(right, i * grid.cellSize), 5 * camera.zoom, Eclipse.Color.LIGHTGREY)
  }
}

function drawBackground(ctx: CanvasRenderingContext2D, color: Eclipse.Color) {
  ctx.fillStyle = color.toString()
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

module.exports = {
  drawScene: drawScene,
}
