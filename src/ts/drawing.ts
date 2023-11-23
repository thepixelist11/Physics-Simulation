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

  // Debug -
  // fillNonEmptyGridCells(ctx, grid, Eclipse.Color.SILVER)
  // -

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
  gridIndex?: gridIndex,
  cursorDisplay?: cursorDisplay,
}
type overlayOptions = {
  position: Eclipse.Vector2,
  color: Eclipse.Color,
  enabled: boolean,
  cam: Camera,
}
type cameraPosOptions = overlayOptions & {
  fontStyle?: string,
  camX?: boolean,
  camY?: boolean,
  camZoom?: boolean,
}
type mousePos = overlayOptions & {
  mouse: Eclipse.Mouse | null,
  fontStyle?: string,
  showX?: boolean,
  showY?: boolean,
}
type gridIndex = overlayOptions & {
  mouse: Eclipse.Mouse | null,
  grid: Grid,
  fontStyle?: string,
  showX?: boolean,
  showY?: boolean,
}
type cursorDisplay = {
  grid: Grid,
  controller: Controller,
  type: 'pointPlace' | 'pointRemove' | 'default'
  opacity: number,
  enabled: boolean,
  cam: Camera,
}

function drawOverlay(ctx: CanvasRenderingContext2D, options: Overlay) {
  // Camera Position
  if(options.cameraPos && options.cameraPos.enabled) {
    ctx.font = options.cameraPos.fontStyle ?? 'courier 100px'
    ctx.fillStyle = options.cameraPos.color.toString()
    let text = ''
    if(options.cameraPos.camX ?? true) text = text.concat(`CamX: ${options.cameraPos.cam.x} `)
    if(options.cameraPos.camY ?? true) text = text.concat(`CamY: ${options.cameraPos.cam.y} `)
    if(options.cameraPos.camZoom ?? true) text = text.concat(`CamZoom: ${options.cameraPos.cam.zoom} `)
    ctx.fillText(text, options.cameraPos.position.x, options.cameraPos.position.y)
  }
  // Global Mouse Position
  if(options.globalMousePos && options.globalMousePos.enabled) {
    ctx.font = options.globalMousePos.fontStyle ?? 'courier 100px'
    ctx.fillStyle = options.globalMousePos.color.toString()
    if(options.globalMousePos.mouse !== null) {
      let text = ''
      if(options.globalMousePos.showX ?? true) text = text.concat(`globalMouseX: ${Math.round((options.globalMousePos.mouse.x + mainCam.x) / options.globalMousePos.cam.zoom)} `)
      if(options.globalMousePos.showY ?? true) text = text.concat(`globalMouseY: ${Math.round((options.globalMousePos.mouse.y + mainCam.y) / options.globalMousePos.cam.zoom)} `)
      ctx.fillText(text, options.globalMousePos.position.x, options.globalMousePos.position.y)
    } else {
      ctx.fillText(
        `Failed to get mouse`, 
        options.globalMousePos.position.x, 
        options.globalMousePos.position.y
      )
    }
  }
  // Relative Mouse Position
  if(options.relativeMousePos && options.relativeMousePos.enabled) {
    ctx.font = options.relativeMousePos.fontStyle ?? 'courier 100px'
    ctx.fillStyle = options.relativeMousePos.color.toString()
    if(options.relativeMousePos.mouse !== null) {
      let text = ''
      if(options.relativeMousePos.showX ?? true) text = text.concat(`mouseX: ${Math.round((options.relativeMousePos.mouse.x) / options.relativeMousePos.cam.zoom)} `)
      if(options.relativeMousePos.showY ?? true) text = text.concat(`mouseY: ${Math.round((options.relativeMousePos.mouse.y) / options.relativeMousePos.cam.zoom)} `)
      ctx.fillText(text, options.relativeMousePos.position.x, options.relativeMousePos.position.y)
    } else {
      ctx.fillText(
        `Failed to get mouse`, 
        options.relativeMousePos.position.x, 
        options.relativeMousePos.position.y
      )
    }
  }
  // Grid Index
  if(options.gridIndex && options.gridIndex.enabled) {
    ctx.font = options.gridIndex.fontStyle ?? 'courier 100px'
    ctx.fillStyle = options.gridIndex.color.toString()
    if(options.gridIndex.mouse !== null) {
      let text = ''
      if(options.gridIndex.showX ?? true) text = text.concat(`gridX: ${Math.floor((options.gridIndex.mouse.x + mainCam.x) / options.gridIndex.cam.zoom / options.gridIndex.grid.cellSize)} `)
      if(options.gridIndex.showY ?? true) text = text.concat(`gridY: ${Math.floor((options.gridIndex.mouse.y + mainCam.y) / options.gridIndex.cam.zoom / options.gridIndex.grid.cellSize)} `)
      ctx.fillText(text, options.gridIndex.position.x, options.gridIndex.position.y)
    } else {
      ctx.fillText(
        `Failed to get mouse`, 
        options.gridIndex.position.x, 
        options.gridIndex.position.y
      )
    }
  }
  // Mouse Cursor
  if(options.cursorDisplay && options.cursorDisplay.enabled) {
    switch(options.cursorDisplay.type) {
      case 'pointPlace':
        ctx.globalAlpha = options.cursorDisplay.opacity
        options.cursorDisplay.controller.mouse.x
        options.cursorDisplay.controller.mouse.y
        Eclipse.drawPoint(
          ctx, 
          options.cursorDisplay.controller.mouse.x, 
          options.cursorDisplay.controller.mouse.y, 
          options.cursorDisplay.controller.pointPlacementRadius
          * options.cursorDisplay.cam.zoom, 
          options.cursorDisplay.controller.pointPlacementColor
        )
        ctx.globalAlpha = 1
        break
    }
  }
}

function fillNonEmptyGridCells(ctx: CanvasRenderingContext2D, grid: Grid, color: Eclipse.Color) {
  for(const cell of grid.cells) {
    const pos = Eclipse.Vector2.create(cell[0])
    ctx.fillStyle = color.toString()
    ctx.fillRect(pos.x * grid.cellSize, pos.y * grid.cellSize, grid.cellSize, grid.cellSize)
  }
}

module.exports = {
  drawScene: drawScene,
  drawOverlay: drawOverlay,
}
