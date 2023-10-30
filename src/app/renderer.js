const { ipcRenderer } = require('electron')

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
canvas.width = 800
canvas.height = 600
window.canvas = canvas
window.ctx = ctx

ipcRenderer.on('newSize', (evt, val) => {
  canvas.width = val[0]
  canvas.height = val[1]
  drawPoints(points)
})

let points = initializePoints()
window.points = points

let loopPhysics = false
window.loopPhysics = loopPhysics

let zoom = 0.1
window.zoom = zoom

function initializePoints() {
  return [new Point(new Vector2(500, 0), 1, 50, Color.RED)]
}

function resetPoints() {
  for (let i = 0; i < points.length; i++) {
    points[i].reset()
  }
}

function drawPoints(points) {
  ctx.save()
  ctx.scale(zoom, zoom)
  for (let i = 0; i < points.length; i++) {
    points[i].draw(ctx)
  }
  ctx.restore()
}

let currentTime,
  deltaTime,
  lastTime,
  start = null
function startPhysics() {
  loopPhysics = true
  setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (loopPhysics) {
      if (lastTime === null || lastTime === undefined) {
        lastTime = new Date().getTime()
      }
      if (start === null || start === undefined) {
        start = new Date().getTime()
      }
      currentTime = new Date().getTime()
      deltaTime = currentTime - lastTime
      physicsUpdate(1, {
        points,
      })
      if (points[0].y > 10000) {
        window.alert((new Date().getTime() - start) / 1000)
        stopPhysics()
      }
      lastTime = currentTime
    }
    drawPoints(points)
  }, 16.67)
}
window.startPhysics = startPhysics

function stopPhysics() {
  loopPhysics = false
  lastTime = null
  start = null
  currentTime = null
  resetPoints()
}
window.stopPhysics = stopPhysics

drawPoints(points)