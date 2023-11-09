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
canvas.width = 800
canvas.height = 600


// Resizes and redraws the canvas when the window is resized. Called from main.js
ipcRenderer.on('newSize', (evt: Event, val: any) => {
  canvas.width = val[0]
  canvas.height = val[1]
  drawScene(mainGrid, ctx, mainCam)
})

// Initializes main grid
let mainGrid = new Grid([], 100)

// Number of pixels per metre
const pxPerM = 100

// Initialize main camera
let mainCam = new Camera(Eclipse.Vector2.ZERO, 0.3)

const controller = new Controller(mainGrid, ctx, mainCam)

// Creates new points
function initializePoints() {
  return [new Point(new Eclipse.Vector2(100, 0), 1, 10, Eclipse.Color.RED)]
}

function resetPoints() {
  for (let i = 0; i < mainGrid.points.length; i++) {
    mainGrid.points[i].reset()
  }
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
    drawScene(mainGrid, ctx, mainCam)
  }, FPS)
}

function stopPhysics() {
  loopPhysics = false
  resetPoints()
}

drawScene(mainGrid, ctx, mainCam)

// Semicolon is needed to prevent drawPoints from calling with the function as param
function setupDebugProperties() {
  // @ts-ignore
  window.startPhysics = startPhysics
  function getMainCam() {
    return mainCam
  }
  // @ts-ignore
  window.getMainCam = getMainCam
  function getGrid() {
    return mainGrid
  }
  // @ts-ignore
  window.getGrid = getGrid

  function generateRandomPoints(minX: number, maxX: number, minY: number, maxY: number, count: number) {
    for(let i = 0; i < count; i++) {
      mainGrid.addPoint(new Point(Eclipse.Vector2.random(minX, maxX, minY, maxY), 1, Eclipse.random(5, 100)))
    }
    drawScene(mainGrid, ctx, mainCam)
  }
  // @ts-ignore
  window.generateRandomPoints = generateRandomPoints
}
setupDebugProperties()
