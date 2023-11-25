require('./eclipse')
require('./primitives')
require('./physics')
require('./drawing')
require('./camera')
require('./grid')
require('./controller')

const { ipcRenderer } = require('electron')

const canvas = document.querySelector('canvas') ?? document.createElement('canvas')
const ctx = canvas.getContext('2d') ?? new CanvasRenderingContext2D()
canvas.width = document.body.clientWidth
canvas.height = document.body.clientHeight

// Resizes and redraws the canvas when the window is resized. Called from main.js
ipcRenderer.on('newSize', (evt: Event, val: any) => {
  canvas.width = val[0]
  canvas.height = val[1]
  drawScene(mainGrid, ctx, mainCam, ConfigObject)
})

// Clears all points
ipcRenderer.on('clearAllPoints', (evt: Event, val: any) => {
  mainGrid.clearAllPoints()
  drawScene(mainGrid, ctx, mainCam, ConfigObject)
})

// Initialize main camera
let mainCam = new Camera(Eclipse.Vector2.ZERO, 1)

// Initializes main grid
let mainGrid = new Grid([], 100)

// Initializes main controller
const controller = new Controller(mainGrid, ctx, mainCam, document)
controller.mouse.onmove = () => {
  drawScene(mainGrid, ctx, mainCam, ConfigObject)
}
controller.pointPlacementRadius = 20
controller.pointDynamicPlacementColor = Eclipse.Color.RED
controller.pointStaticPlacementColor = Eclipse.Color.BLUE

// Number of pixels per metre
const pxPerM = 100

// Configuration for simulation
const ConfigObject: ConfigType = {
  uiConfig: {
    cameraPos: {
      enabled: true,
      position: new Eclipse.Vector2(5, 15),
      color: Eclipse.Color.BLACK,
      cam: mainCam,
      camX: true,
      camY: true,
      camZoom: true,
    },
    globalMousePos: {
      enabled: true,
      position: new Eclipse.Vector2(5, 30),
      color: Eclipse.Color.BLACK,
      mouse: controller.mouse,
      cam: mainCam,
    },
    relativeMousePos: {
      enabled: true,
      position: new Eclipse.Vector2(5, 45),
      color: Eclipse.Color.BLACK,
      mouse: controller.mouse,
      cam: mainCam,
    },
    gridIndex: {
      enabled: true,
      position: new Eclipse.Vector2(5, 60),
      color: Eclipse.Color.BLACK,
      mouse: controller.mouse,
      grid: mainGrid,
      cam: mainCam,
    },
    cursorDisplay: {
      enabled: true,
      grid: mainGrid,
      controller: controller,
      type: 'pointPlace',
      opacity: 0.5,
      cam: mainCam
    },
    entityDisplay: {
      enabled: true,
      grid: mainGrid,
      position: new Eclipse.Vector2(5, 75),
      staticColor: Eclipse.Color.BLUE,
      dynamicColor: Eclipse.Color.RED,
      totalColor: Eclipse.Color.BLACK,
      showDynamic: true,
      showStatic: true,
      showTotal: true,
      spacingBetweenTotals: 3
    },
    cellSize: pxPerM,
    drawGridLines: true,
  }, 
  generalConfig: {
    spacPartCellSize: 500,
    allowDynamicPointsOnPoints: false,
    allowStaticPointsOnPoints: true,
  },
  debugConfig: {
    fillFilledGridCells: false,
  }
}

mainGrid.cellSize = ConfigObject.generalConfig.spacPartCellSize

function generatePointGrid(width: number, height: number, radii: number, color: Eclipse.Color, spacingX: number, spacingY: number, offsetX: number, offsetY: number, isStatic = true) {
  for(let i = -width / 2 + offsetX; i <= width / 2 + offsetX; i += spacingX) {
    for(let j = -height / 2 + offsetY; j <= height / 2 + offsetY; j += spacingY) {
      mainGrid.addPoint(new Point(new Eclipse.Vector2(i, j), 1, radii, color, isStatic))
    }
  }
}

type ConfigType = {
  uiConfig: Overlay,
  generalConfig: {
    spacPartCellSize: number,
    allowDynamicPointsOnPoints: boolean,
    allowStaticPointsOnPoints: boolean,
  },
  debugConfig: {
    fillFilledGridCells?: boolean
  }
}

function resetPoints() {
  for (let i = 0; i < mainGrid.points.length; i++) {
    mainGrid.points[i].reset()
  }
  mainGrid.updateCells()
}

// When false will call cancelInterval in main loop
let loopPhysics = false
// Time since simulation started in ms
let time = 0
// Time in ms to pass per frame. Lower number reduces performance, but increases accuracy. 
// Do not go below 0.01667 or results will be inaccurate due to numerical instability of floats
let timeStep = 16.67
// The desired fps to run at. Does not affect the update timestep
const FPS = 16.67

// Main physics loop
function startPhysics() {
  timeStep = Eclipse.clamp(timeStep, 0.01667, 16.67)
  time = 0
  loopPhysics = true
  // Main loop
  const loop = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < Math.ceil((FPS * 1000) / (timeStep * 1000)); i++) {
      if (!loopPhysics) {
        clearInterval(loop)
        break
      }
      updatePoints(timeStep / 1000, mainGrid, pxPerM)

      // Increment time
      time += timeStep
    }
    drawScene(mainGrid, ctx, mainCam, ConfigObject)
  }, FPS)
}

// Setup events and loops
controller.mouse.onlmbdown = () => {
  switch(loopPhysics) {
    case false:
      // Create new dynamic point
      let p = new Point(new Eclipse.Vector2(
        (controller.mouse.x + mainCam.x) / mainCam.zoom,
        (controller.mouse.y + mainCam.y) / mainCam.zoom,
      ), 1, controller.pointPlacementRadius, controller.pointDynamicPlacementColor, false)
      if(ConfigObject.generalConfig.allowDynamicPointsOnPoints || (!mainGrid.pointOverlapping(p))) {
        mainGrid.addPoint(p)
        drawScene(mainGrid, ctx, mainCam, ConfigObject)
      }
      break
  }
}

controller.mouse.onrmbdown = () => {
  switch(loopPhysics) {
    case false:
      // Create new static point
      let p = new Point(new Eclipse.Vector2(
        (controller.mouse.x + mainCam.x) / mainCam.zoom,
        (controller.mouse.y + mainCam.y) / mainCam.zoom,
      ), 1, controller.pointPlacementRadius, controller.pointStaticPlacementColor, true)
      if(ConfigObject.generalConfig.allowStaticPointsOnPoints || (!mainGrid.pointOverlapping(p))) {
        mainGrid.addPoint(p)
        drawScene(mainGrid, ctx, mainCam, ConfigObject)
      }
      break
  }
}

controller.mouse.onscroll = (evt: WheelEvent) => {
  controller.pointPlacementRadius += -evt.deltaY / (controller.keyboard.shiftDown ? 10 : 100)
  controller.pointPlacementRadius = Eclipse.clamp(controller.pointPlacementRadius, 1, 10000)
  drawScene(mainGrid, ctx, mainCam, ConfigObject)
}

controller.keyboard.onkeydown = (code: Eclipse.Key) => {
  if(code === 'Space') {
    if(loopPhysics) {
      stopPhysics()
    } else {
      startPhysics()
    }
  }
}

controller.keyboard

function stopPhysics() {
  loopPhysics = false
  resetPoints()
}

drawScene(mainGrid, ctx, mainCam, ConfigObject)
