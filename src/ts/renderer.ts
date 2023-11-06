require('./eclipse')
require('./primitives')
require('./physics')
require('./drawing')
require('./camera')
require('./grid')

const { ipcRenderer } = require('electron')

const canvas = document.querySelector('canvas') ?? document.createElement('canvas')
const ctx = canvas.getContext('2d') ?? new CanvasRenderingContext2D()
canvas.width = 800
canvas.height = 600

// Resizes and redraws the canvas when the window is resized. Called from main.js
ipcRenderer.on('newSize', (evt: Event, val: any) => {
  canvas.width = val[0]
  canvas.height = val[1]
  drawScene(points, ctx, mainCam)
})

// Initializes points
// TODO: Allow user to add points. Initialize as empty array
let points = initializePoints()

// Initialize main camera
let mainCam = new Camera(Eclipse.Vector2.ZERO, 1)

// Creates new points
function initializePoints() {
  return [new Point(new Eclipse.Vector2(100, 0), 1, 10, Eclipse.Color.RED)]
}

function resetPoints() {
  for (let i = 0; i < points.length; i++) {
    points[i].reset()
  }
}

// When false will call cancelInterval in main loop
let loopPhysics = false
// Time since simulation started in ms
let time = 0
// Time in ms to pass per frame. 16.67 is 60 fps
const timeStep = 16.67
// The desired fps to run at. Does not affect the update timestep
const FPS = 1 / 60
function startPhysics() {
  time = 0
  loopPhysics = true
  // Main loop
  const loop = setInterval(() => {
    for (let i = 0; i < Math.ceil(FPS / (timeStep / 1000)); i++) {
      if (!loopPhysics) {
        clearInterval(loop)
        break
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      updatePoints(timeStep / 1000, points)

      // Find how long it takes for point 0 to fall a certain number of units
      if (points[0].y > 100000) {
        window.alert(time / 1000)
        stopPhysics()
      }

      // Increment time
      time += timeStep
    }
    drawScene(points, ctx, mainCam)
  }, timeStep)
}

function stopPhysics() {
  loopPhysics = false
  resetPoints()
}

drawScene(points, ctx, mainCam)

// Semicolon is needed to prevent drawPoints from calling with the function as param
function setupDebugProperties() {
  // @ts-ignore
  window.startPhysics = startPhysics
  function getPoints() {
    return points
  }
  // @ts-ignore
  window.getPoints = getPoints
  function getMainCam() {
    return mainCam
  }
  // @ts-ignore
  window.getMainCam = getMainCam
}
setupDebugProperties()

const testGrid = new Grid([
  new Point(new Eclipse.Vector2(3, 3), 1, 1),
  new Point(new Eclipse.Vector2(4, 6), 1, 2),
  new Point(new Eclipse.Vector2(8, 4), 1, 4),
], 4)

console.log(testGrid.cells)