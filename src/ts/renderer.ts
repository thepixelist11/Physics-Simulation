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
  drawScene(mainGrid, ctx, mainCam, Config.uiConfig)
})

// Initializes main grid
let mainGrid = new Grid([
  new Point(new Eclipse.Vector2(-50, 0), 1, 30, Eclipse.Color.RED, false),
  new Point(new Eclipse.Vector2(0, 300), 1, 80, Eclipse.Color.BLUE, true),
  new Point(new Eclipse.Vector2(250, 470), 1, 80, Eclipse.Color.GREEN, true),
  new Point(new Eclipse.Vector2(-20, 700), 1, 80, Eclipse.Color.BLUE, true),
  new Point(new Eclipse.Vector2(170, 880), 1, 80, Eclipse.Color.GREEN, true),
], 100)

// Number of pixels per metre
const pxPerM = 100

// Initialize main camera
let mainCam = new Camera(Eclipse.Vector2.ZERO, 0.2)

const controller = new Controller(mainGrid, ctx, mainCam, document)
controller.mouse.onmove = () => {
  drawScene(mainGrid, ctx, mainCam, Config.uiConfig)
}

// Configuration for simulation
const Config = {
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
    }
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
const timeStep = 16.67
// The desired fps to run at. Does not affect the update timestep
const FPS = 16.67
function startPhysics() {
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

      // Find how long it takes for point 0 to fall a certain number of units
      if (mainGrid.points[0].y > 1000 * pxPerM) {
        window.alert(time / 1000)
        stopPhysics()
      }

      // Increment time
      time += timeStep
    }
    drawScene(mainGrid, ctx, mainCam, Config.uiConfig)
  }, FPS)
}

function stopPhysics() {
  loopPhysics = false
  resetPoints()
}

drawScene(mainGrid, ctx, mainCam, Config.uiConfig)
