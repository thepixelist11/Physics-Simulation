require('./eclipse')
require('./primitives')
require('./camera')
require('./controller')

function drawPoints(points: Array<Point>, ctx: CanvasRenderingContext2D) {
  for (let i = 0; i < points.length; i++) {
    points[i].draw(ctx)
  }
}

function drawPointArrows(
  points: Array<Point>, 
  arrowSize: number, 
  arrowWidth: number, 
  xColor: Eclipse.Color, 
  yColor: Eclipse.Color,
  centreColor: Eclipse.Color,
  xHoveredColor: Eclipse.Color,
  yHoveredColor: Eclipse.Color,
  centreHoveredColor: Eclipse.Color
) {
  for(let i = 0; i < points.length; i++) {
    if(!canDrawScene) break
    if(points[i].identifier === controller.selectedPoint?.identifier) {
      points[i].drawMovementArrows(arrowSize, arrowWidth, xColor, yColor, centreColor, xHoveredColor, yHoveredColor, centreHoveredColor)
    }
  }
}

function drawScene(grid: Grid, ctx: CanvasRenderingContext2D, camera: Camera, ConfigObject: ConfigType, bgColor = Eclipse.Color.WHITE) {
  drawBackground(ctx, bgColor)
  ctx.save()
  ctx.translate(-camera.x, -camera.y)
  ctx.scale(camera.zoom, camera.zoom)

  // For implementing zooming in the future
  // ctx.transform(camera.zoom, 0, 0, camera.zoom, canvas.width / 2 - camera.x * camera.zoom, canvas.height / 2 - camera.y * camera.zoom);
  
  // Debug -
  if(ConfigObject.debugConfig.fillFilledGridCells ?? false) { 
    fillNonEmptyGridCells(ctx, grid, Eclipse.Color.SILVER)
  }
  // -
  
  drawGrid(grid, ctx, camera, ConfigObject)
  drawPoints(grid.points, ctx)
  ctx.restore()
  
  drawWalls()

  drawOverlay(ctx, ConfigObject.uiConfig)
}

function drawGrid(grid: Grid, ctx: CanvasRenderingContext2D, camera: Camera, ConfigObject: ConfigType) {
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
  
  if(ConfigObject.uiConfig.drawGridLines ?? true) {
    // Vertical Grid Lines
    for(let i = Math.floor(left / (ConfigObject.uiConfig.cellSize ?? 100)); i <= Math.floor(right / (ConfigObject.uiConfig.cellSize ?? 100)); i++) {
      Eclipse.drawLine(ctx, new Eclipse.Vector2(i * (ConfigObject.uiConfig.cellSize ?? 100), top), new Eclipse.Vector2(i * (ConfigObject.uiConfig.cellSize ?? 100), bottom), ConfigObject.uiConfig.gridLineWeight, Eclipse.Color.LIGHTGREY)
    }
    // Horizontal Grid Lines
    for(let i = Math.floor(top / (ConfigObject.uiConfig.cellSize ?? 100)); i <= Math.floor(bottom / (ConfigObject.uiConfig.cellSize ?? 100)); i++) {
      Eclipse.drawLine(ctx, new Eclipse.Vector2(left, i * (ConfigObject.uiConfig.cellSize ?? 100)), new Eclipse.Vector2(right, i * (ConfigObject.uiConfig.cellSize ?? 100)), ConfigObject.uiConfig.gridLineWeight, Eclipse.Color.LIGHTGREY)
    }
  }
}

function drawWalls() {
  for(let i = 0; i < mainGrid.walls.length; i++) {
    const w = mainGrid.walls[i]
    w.draw()
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
  cellSize?: number,
  entityDisplay?: entityDisplay,
  drawGridLines?: boolean,
  selectedPointOutlineColor?: Eclipse.Color,
  selectedPointOutlineRadius?: number,
  selectedIdentifier?: selectedIdentifier,
  selectionArrows?: selectedArrows,
  cursorStyle?: Eclipse.CSSCursorStyle,
  gridLineWeight: number,
  // FBD: FBD,
  selectedPointInfo: SelectedPointInfo
}
type overlayOptions = {
  position: Eclipse.Vector2,
  color: Eclipse.Color,
  enabled: boolean,
}
type cameraPosOptions = overlayOptions & {
  fontStyle?: string,
  camX?: boolean,
  camY?: boolean,
  camZoom?: boolean,
  cam: Camera,
}
type mousePos = overlayOptions & {
  fontStyle?: string,
  showX?: boolean,
  showY?: boolean,
  cam: Camera,
}
type gridIndex = overlayOptions & {
  fontStyle?: string,
  showX?: boolean,
  showY?: boolean,
  cam: Camera,
}
type cursorDisplay = {
  type: 'pointPlace' | 'pointRemove' | 'default'
  opacity: number,
  enabled: boolean,
  cam: Camera,
  showWhileMouseInPoint: boolean,
}
type entityDisplay = {
  showTotal?: boolean,
  showDynamic?: boolean,
  showStatic?: boolean,
  fontStyle?: string,
  enabled: boolean,
  staticColor: Eclipse.Color,
  dynamicColor: Eclipse.Color,
  totalColor: Eclipse.Color,
  position: Eclipse.Vector2,
  spacingBetweenTotals?: number,
}
type selectedIdentifier = overlayOptions & {
  fontStyle?: string
}
type selectedArrows = {
  width?: number,
  lengthAdded?: number,
  yColor?: Eclipse.Color,
  xColor?: Eclipse.Color,
  centreColor?: Eclipse.Color,
  xHoveredColor?: Eclipse.Color,
  yHoveredColor?: Eclipse.Color,
  centreHoveredColor?: Eclipse.Color
}
type FBD = {
  width?: number,
  height?: number,
  position: Eclipse.CornerPosition,
  offset?: Eclipse.Vector2,
  color?: Eclipse.Color,
  enabled: boolean,
  outlineWeight?: number,
  arrowMaxMagnitude: number
}
type SelectedPointInfo = {
  fontStyle?: string,
  position: Eclipse.Vector2,
  enabled: boolean,
  color: Eclipse.Color,
  lineHeight: number
}

function drawOverlay(ctx: CanvasRenderingContext2D, options: Overlay) {
  // Mouse Cursor
  if(options.cursorDisplay && 
    options.cursorDisplay.enabled && 
    controller.canPlacePoint && 
    controller.selectionArrowHovered === null && 
    !controller.selectionArrowDragged &&
    controller.mouse.hoveredElement()?.id === 'mainCanvas'
  ) {
    switch(options.cursorDisplay.type) {
      case 'pointPlace':
          ctx.globalAlpha = options.cursorDisplay.opacity
          controller.mouse.x
          controller.mouse.y
          Eclipse.drawPoint(
          ctx, 
          controller.mouse.x, 
          controller.mouse.y, 
          controller.pointPlacementRadius
          * options.cursorDisplay.cam.zoom, 
          controller.keyboard.shiftDown ? 
          controller.pointStaticPlacementColor :
          controller.pointDynamicPlacementColor
          )
        ctx.globalAlpha = 1
        break
    }
  }
  
  ctx.save()
  ctx.translate(-mainCam.x, -mainCam.y)
  ctx.scale(mainCam.zoom, mainCam.zoom)
  drawPointArrows(
    mainGrid.points, 
    (options.selectionArrows?.lengthAdded ?? 20) / mainCam.zoom, 
    (options.selectionArrows?.width ?? 2) / mainCam.zoom, 
    (options.selectionArrows?.xColor ?? Eclipse.Color.GREEN), 
    (options.selectionArrows?.yColor ?? Eclipse.Color.BLUE),
    (options.selectionArrows?.centreColor ?? Eclipse.Color.YELLOW),
    (options.selectionArrows?.xHoveredColor ?? Eclipse.Color.FORESTGREEN),
    (options.selectionArrows?.yHoveredColor ?? Eclipse.Color.MIDNIGHTBLUE),
    (options.selectionArrows?.centreHoveredColor ?? Eclipse.Color.GOLD),
  )
  ctx.restore()

  // Camera Position
  if(options.cameraPos && options.cameraPos.enabled) {
    ctx.font = options.cameraPos.fontStyle ?? 'courier 100px'
    ctx.fillStyle = options.cameraPos.color.toString()
    let text = ''
    if(options.cameraPos.camX ?? true) text = text.concat(`CamX: ${options.cameraPos.cam.x} `)
    if(options.cameraPos.camY ?? true) text = text.concat(`CamY: ${options.cameraPos.cam.y} `)
    if(options.cameraPos.camZoom ?? true) text = text.concat(`CamZoom: ${options.cameraPos.cam.zoom.toFixed(4)} `)
    ctx.fillText(text, options.cameraPos.position.x, options.cameraPos.position.y)
  }
  // Global Mouse Position
  if(options.globalMousePos && options.globalMousePos.enabled) {
    ctx.font = options.globalMousePos.fontStyle ?? 'courier 100px'
    ctx.fillStyle = options.globalMousePos.color.toString()
    if(controller.mouse !== null) {
      let text = ''
      if(options.globalMousePos.showX ?? true) text = text.concat(`globalMouseX: ${Math.round(controller.getGlobalMousePosition().x)} `)
      if(options.globalMousePos.showY ?? true) text = text.concat(`globalMouseY: ${Math.round(controller.getGlobalMousePosition().y)} `)
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
    if(controller.mouse !== null) {
      let text = ''
      if(options.relativeMousePos.showX ?? true) text = text.concat(`mouseX: ${Math.round((controller.mouse.x) / options.relativeMousePos.cam.zoom)} `)
      if(options.relativeMousePos.showY ?? true) text = text.concat(`mouseY: ${Math.round((controller.mouse.y) / options.relativeMousePos.cam.zoom)} `)
      ctx.fillText(text, options.relativeMousePos.position.x, options.relativeMousePos.position.y)
    } else {
      ctx.fillText(
        `Failed to get mouse`, 
        options.relativeMousePos.position.x, 
        options.relativeMousePos.position.y
      )
    }
  }
  // Visual Grid Index
  if(options.gridIndex && options.gridIndex.enabled) {
    ctx.font = options.gridIndex.fontStyle ?? 'courier 100px'
    ctx.fillStyle = options.gridIndex.color.toString()
    if(controller.mouse !== null) {
      let text = ''
      if(options.gridIndex.showX ?? true) text = text.concat(`gridX: ${Math.floor((controller.mouse.x + mainCam.x) / options.gridIndex.cam.zoom / (ConfigObject.uiConfig.cellSize ?? 100))} `)
      if(options.gridIndex.showY ?? true) text = text.concat(`gridY: ${Math.floor((controller.mouse.y + mainCam.y) / options.gridIndex.cam.zoom / (ConfigObject.uiConfig.cellSize ?? 100))} `)
      ctx.fillText(text, options.gridIndex.position.x, options.gridIndex.position.y)
    } else {
      ctx.fillText(
        `Failed to get mouse`, 
        options.gridIndex.position.x, 
        options.gridIndex.position.y
      )
    }
  }
  // Entity Display
  if(options.entityDisplay && options.entityDisplay.enabled) {
    ctx.font = options.entityDisplay.fontStyle ?? 'courier 100px'
    let textX = parseInt(JSON.parse(JSON.stringify(options.entityDisplay.position.x)))
    if(options.entityDisplay.showTotal ?? true) {
      ctx.fillStyle = options.entityDisplay.totalColor.toString()
      let text = `Total Entities: ${mainGrid.points.length} `
      ctx.fillText(text, textX, options.entityDisplay.position.y)
      textX += ctx.measureText(text).width + (options.entityDisplay.spacingBetweenTotals ?? 0)
    }
    if(options.entityDisplay.showDynamic ?? true) {
      ctx.fillStyle = options.entityDisplay.dynamicColor.toString()
      let text = `Dynamic Entities: ${mainGrid.totalDynamic} `
      ctx.fillText(text, textX, options.entityDisplay.position.y)
      textX += ctx.measureText(text).width + (options.entityDisplay.spacingBetweenTotals ?? 0)
    }
    if(options.entityDisplay.showStatic ?? true) {
      ctx.fillStyle = options.entityDisplay.staticColor.toString()
      let text = `Static Entities: ${mainGrid.totalStatic} `
      ctx.fillText(text, textX, options.entityDisplay.position.y)
    }
  }
  // Selected Identifier
  if(options.selectedIdentifier && options.selectedIdentifier.enabled) {
    ctx.font = options.selectedIdentifier.fontStyle ?? 'courier 100px'
    ctx.fillStyle = options.selectedIdentifier.color.toString()
    let text = controller.selectedPoint?.identifier.toString()
    ctx.fillText(`Selected Point ID: ${text ?? 'None'}`, options.selectedIdentifier.position.x, options.selectedIdentifier.position.y)
  }
  // FIXME: Add extra options for these. Currently using selected identifier settings
  // Camera Locked?
  if(options.selectedIdentifier && options.selectedIdentifier.enabled) {
    ctx.font = options.selectedIdentifier.fontStyle ?? 'courier 100px'
    ctx.fillStyle = options.selectedIdentifier.color.toString()
    ctx.fillText(`Camera Locked To Point: ${cameraLock}`, options.selectedIdentifier.position.x, options.selectedIdentifier.position.y + 15)
  }
  // COR
  if(options.selectedIdentifier && options.selectedIdentifier.enabled) {
    ctx.font = options.selectedIdentifier.fontStyle ?? 'courier 100px'
    ctx.fillStyle = options.selectedIdentifier.color.toString()
    ctx.fillText(`Corefficient of Restitiution: ${COR}`, options.selectedIdentifier.position.x, options.selectedIdentifier.position.y + 30)
  }
  // Gravity
  if(options.selectedIdentifier && options.selectedIdentifier.enabled) {
    ctx.font = options.selectedIdentifier.fontStyle ?? 'courier 100px'
    ctx.fillStyle = options.selectedIdentifier.color.toString()
    ctx.fillText(`Gravity: ${gravity.y} m/s^2`, options.selectedIdentifier.position.x, options.selectedIdentifier.position.y + 45)
  }
  // Selected Point Info
  if(options.selectedPointInfo && options.selectedPointInfo.enabled && controller.selectedPoint) {
    ctx.font = options.selectedPointInfo.fontStyle ?? 'courier 100px'
    ctx.fillStyle = options.selectedPointInfo.color.toString()
    const p = controller.selectedPoint
    const text = `Position: ${p.position.apply(val => {return parseFloat(val.toFixed(4))}).getDiv(pxPerM).toString()} m
Last Position: ${p.lastPosition.apply(val => {return parseFloat(val.toFixed(4))}).getDiv(pxPerM).toString()} m
Velocity: ${p.velocity.apply(val => {return parseFloat(val.toFixed(4))}).toString()} m/s
LastVelocity: ${p.lastVelocity.apply(val => {return parseFloat(val.toFixed(4))}).toString()} m/s
Acceleration: ${p.acceleration.apply(val => {return parseFloat(val.toFixed(4))}).toString()} m/s^2
Radius: ${(p.radius / pxPerM).toFixed(4)} m
Color: ${p.color.toString()}
Mass: ${p.mass.toFixed(4)} kg
Static: ${p.isStatic}
On Wall: ${p.onWall}`
    const splitText = text.split('\n')
    for(let i = 0; i < splitText.length; i++) {
      ctx.fillText(
        splitText[i], 
        options.selectedPointInfo.position.x, 
        options.selectedPointInfo.position.y + (i * options.selectedPointInfo.lineHeight))
    }
  }

  // Selected Point FBD
  // if(options.FBD && options.FBD.enabled && controller.selectedPoint && loopPhysics) {
  //   ctx.fillStyle = (options.FBD.color ?? Eclipse.Color.DARKGREY).toString()
  //   const offset = options.FBD.offset ?? Eclipse.Vector2.ZERO
  //   const width = options.FBD.width ?? 100
  //   const height = options.FBD.height ?? 100

  //   let position = Eclipse.Vector2.ZERO
  //   switch(options.FBD.position) {
  //     case "bottom-right":
  //       position = new Eclipse.Vector2(window.innerWidth + offset.x - width, window.innerHeight + offset.y - height)
  //       break
  //     case "bottom-left":
  //       position = new Eclipse.Vector2(offset.x, window.innerHeight + offset.y - height)
  //       break
  //     case "top-right":
  //       position = new Eclipse.Vector2(window.innerWidth + offset.x - width, offset.y)
  //       break
  //     case "top-left":
  //       position = new Eclipse.Vector2(offset.x, offset.y)
  //       break
  //   }
  //   ctx.fillRect(position.x, position.y, width, height)

  //   ctx.beginPath()
  //   ctx.lineWidth = options.FBD.outlineWeight ?? 5
  //   ctx.strokeStyle = (options.FBD.color ?? Eclipse.Color.DARKGREY).getDarken(30).toString()
  //   ctx.rect(position.x, position.y, width, height)
  //   ctx.stroke()

  //   drawFBDArrows(position.getAdd(new Eclipse.Vector2(width / 2, height / 2)), options.FBD.arrowMaxMagnitude)
  // }
}

function fillNonEmptyGridCells(ctx: CanvasRenderingContext2D, grid: Grid, color: Eclipse.Color) {
  for(const cell of grid.cells) {
    const pos = Eclipse.Vector2.create(cell[0])
    ctx.fillStyle = color.toString()
    ctx.fillRect(pos.x * grid.cellSize, pos.y * grid.cellSize, grid.cellSize, grid.cellSize)
  }
}

function drawFBDArrows(position: Eclipse.Vector2, magnitude: number) {
  const FG = (controller.selectedPoint?.mass ?? 0) * gravity.mag()
  const gravVector = gravity.getNormalized().getMult(magnitude)
  const gravTextPos = position.getAdd(gravVector.getDiv(2)).getAdd(new Eclipse.Vector2(10, 0))
  const colors = {
    gravity: Eclipse.Color.BLUE
  }
  ctx.font = 'courier 200px'
  ctx.fillStyle = colors.gravity.toString()
  ctx.fillText(`Fg: ${FG}N`, gravTextPos.x, gravTextPos.y)
  drawArrow(position, gravVector.getAdd(position), colors.gravity, 5) // Gravity
}

function drawArrow(start: Eclipse.Vector2, end: Eclipse.Vector2, color: Eclipse.Color, width: number) {
  // Body
  Eclipse.drawLine(ctx, start, end, width, color)

  // Head
  Eclipse.drawPoint(ctx, end, width, color)
}