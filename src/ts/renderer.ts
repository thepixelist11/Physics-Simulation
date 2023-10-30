import * as Eclipse from './eclipse.ts'
import { Point } from './primitives.ts'
import { gravity, updatePoints } from './physics.ts'

const { ipcRenderer } = require('electron')

const canvas = document.querySelector('canvas') ?? document.createElement('canvas')
const ctx = canvas.getContext('2d') ?? new CanvasRenderingContext2D()
canvas.width = 800
canvas.height = 600

ipcRenderer.on('newSize', (evt: Event, val: any) => {
  canvas.width = val[0]
  canvas.height = val[1]
  drawPoints(points)
})

let points = initializePoints()

let loopPhysics = false

let zoom = 0.1

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

let currentTime,
  deltaTime: number,
  lastTime: number | null,
  start: number | null = null
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
      updatePoints(1, points)
      if (points[0].y > 10000) {
        window.alert((new Date().getTime() - start) / 1000)
        stopPhysics()
      }
      lastTime = currentTime
    }
    drawPoints(points)
  }, 16.67)
}

function stopPhysics() {
  loopPhysics = false
  lastTime = null
  start = null
  currentTime = null
  resetPoints()
}

drawPoints(points)