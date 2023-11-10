require('./eclipse')
require('./primitives')
require('./camera')
require('./controller')

function drawPoints(points: Array<Point>, ctx: CanvasRenderingContext2D) {
  for (let i = 0; i < points.length; i++) {
    points[i].draw(ctx)
  }
}

function drawScene(grid: Grid, ctx: CanvasRenderingContext2D, camera: Camera, overlayOptions: Overlay, bgColor = Eclipse.Color.WHITE) {
  drawBackground(ctx, bgColor)
  ctx.save()
  ctx.translate(-camera.x, -camera.y)
  ctx.scale(camera.zoom, camera.zoom)
  // TODO: Allow toggling on and off grid lines on top
  drawGrid(grid, ctx, camera)
  drawPoints(grid.points, ctx)
  ctx.restore()

  drawOverlay(ctx, overlayOptions)
}

function drawGrid(grid: Grid, ctx: CanvasRenderingContext2D, camera: Camera) {
  const canvas = ctx.canvas
  let { left, right, top, bottom } = canvas.getBoundingClientRect()
  // Scale grid based on camera
  right += camera.x
  left += camera.x
  top += camera.y
  bottom += camera.y
  
  right *= 1 / camera.zoom
  left *= 1 / camera.zoom
  top *= 1 / camera.zoom
  bottom *= 1 / camera.zoom
  
  // Vertical Grid Lines
  for(let i = Math.floor(left / grid.cellSize); i <= Math.floor(right / grid.cellSize); i++) {
    Eclipse.drawLine(ctx, new Eclipse.Vector2(i * grid.cellSize, top), new Eclipse.Vector2(i * grid.cellSize, bottom), 5 * camera.zoom, Eclipse.Color.LIGHTGREY)
  }
  // Horizontal Grid Lines
  for(let i = Math.floor(top / grid.cellSize); i <= Math.floor(bottom / grid.cellSize); i++) {
    Eclipse.drawLine(ctx, new Eclipse.Vector2(left, i * grid.cellSize), new Eclipse.Vector2(right, i * grid.cellSize), 5 * camera.zoom, Eclipse.Color.LIGHTGREY)
  }
}

function drawBackground(ctx: CanvasRenderingContext2D, color: Eclipse.Color) {
  ctx.fillStyle = color.toString()
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

type Overlay = {
  cameraPos?: cameraPosOptions,
  globalMousePos?: mousePos,
  relativeMousePos?: mousePos,
}
type overlayOptions = {
  position: Eclipse.Vector2,
  color: Eclipse.Color,
  enabled: boolean,
}
type cameraPosOptions = overlayOptions & {
  fontStyle?: string,
  cam: Camera,
  camX?: boolean,
  camY?: boolean,
  camZoom?: boolean,
}
type mousePos = overlayOptions & {
  mouse: Eclipse.Mouse | null,
  fontStyle?: string,
  x?: boolean,
  y?: boolean,
}

function drawOverlay(ctx: CanvasRenderingContext2D, options: Overlay) {
  if(options.cameraPos && options.cameraPos.enabled) {
    ctx.font = options.cameraPos.fontStyle ?? 'courier 100px'
    ctx.fillStyle = options.cameraPos.color.toString()
    let text = ''
    if(options.cameraPos.camX ?? true) text = text.concat(`CamX: ${options.cameraPos.cam.x} `)
    if(options.cameraPos.camY ?? true) text = text.concat(`CamY: ${options.cameraPos.cam.y} `)
    if(options.cameraPos.camZoom ?? true) text = text.concat(`CamZoom: ${options.cameraPos.cam.zoom} `)
    ctx.fillText(text, options.cameraPos.position.x, options.cameraPos.position.y)
  }
  if(options.globalMousePos && options.globalMousePos.enabled) {
    ctx.font = options.globalMousePos.fontStyle ?? 'courier 100px'
    ctx.fillStyle = options.globalMousePos.color.toString()
    if(options.globalMousePos.mouse !== null) {
      let text = ''
      if(options.globalMousePos.x ?? true) text = text.concat(`globalMouseX: ${options.globalMousePos.mouse.x + mainCam.x} `)
      if(options.globalMousePos.y ?? true) text = text.concat(`globalMouseY: ${options.globalMousePos.mouse.y + mainCam.y} `)
      ctx.fillText(text, options.globalMousePos.position.x, options.globalMousePos.position.y)
    } else {
      ctx.fillText(
        `Failed to get mouse`, 
        options.globalMousePos.position.x, 
        options.globalMousePos.position.y
      )
    }
  }
  if(options.relativeMousePos && options.relativeMousePos.enabled) {
    ctx.font = options.relativeMousePos.fontStyle ?? 'courier 100px'
    ctx.fillStyle = options.relativeMousePos.color.toString()
    if(options.relativeMousePos.mouse !== null) {
      let text = ''
      if(options.relativeMousePos.x ?? true) text = text.concat(`mouseX: ${options.relativeMousePos.mouse.x + mainCam.x} `)
      if(options.relativeMousePos.y ?? true) text = text.concat(`mouseY: ${options.relativeMousePos.mouse.y + mainCam.y} `)
      ctx.fillText(text, options.relativeMousePos.position.x, options.relativeMousePos.position.y)
    } else {
      ctx.fillText(
        `Failed to get mouse`, 
        options.relativeMousePos.position.x, 
        options.relativeMousePos.position.y
      )
    }
  }
}

module.exports = {
  drawScene: drawScene,
  drawOverlay: drawOverlay,
}
