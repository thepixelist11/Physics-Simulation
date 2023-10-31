require('./eclipse')
require('./primitives')
require('./physics')

const { ipcRenderer } = require('electron')

const canvas = document.querySelector('canvas') ?? document.createElement('canvas')
const ctx = canvas.getContext('2d') ?? new CanvasRenderingContext2D()
canvas.width = 800
canvas.height = 600

// Resizes and redraws the canvas when the window is resized. Called from main.js
// TODO: Implement draw function that draws everything rather than just points
ipcRenderer.on('newSize', (evt: Event, val: any) => {
  canvas.width = val[0]
  canvas.height = val[1]
  drawPoints(points)
})

// Initializes points
// TODO: Allow user to add points. Initialize as empty array
let points = initializePoints()

let zoom = 0.1

// Creates new points
function initializePoints() {
  return [new Point(new Eclipse.Vector2(500, 0), 1, 50, Eclipse.Color.RED)]
}

function resetPoints() {
  for (let i = 0; i < points.length; i++) {
    points[i].reset()
  }
}

function drawPoints(points: Array<Point>) {
  ctx.save()
  ctx.scale(zoom, zoom)
  for (let i = 0; i < points.length; i++) {
    points[i].draw(ctx)
  }
  ctx.restore()
}

// When false will call cancelInterval in main loop
let loopPhysics = false
// Time since simulation started in ms
let time = 0
// Time in ms to pass per frame. 16.67 is 60 fps
const timeStep = 16.67
function startPhysics() {
  time = 0
  loopPhysics = true
  // Main loop
  const loop = setInterval(() => {
    if (!loopPhysics) {
      clearInterval(loop)
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    updatePoints(1, points)

    // Find how long it takes for point 0 to fall 20,000 units
    if (points[0].y > 20000) {
      window.alert(time / 1000)
      stopPhysics()
    }

    drawPoints(points)
    // Increment time
    time += timeStep
  }, timeStep)
}

function stopPhysics() {
  loopPhysics = false
  resetPoints()
}

drawPoints(points)

// Semicolon is needed to prevent drawPoints from calling with the function as param
;(function setupDebugProperties() {
  // @ts-ignore
  window.startPhysics = startPhysics
  function getPoints() {
    return points
  }
  // @ts-ignore
  window.getPoints = getPoints
})
