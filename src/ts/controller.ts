require('./eclipse')
require('./camera')
require('./drawing')
require('./grid')

// FIXME: Redo input handling
class Controller {
  keyboard
  mouse
  constructor(grid: Grid, ctx: CanvasRenderingContext2D, camera: Camera, doc: Document) {
    this.keyboard = new Eclipse.KeyBoard()
    this.mouse = new Eclipse.Mouse(doc)
    setInterval(() => {
      // Movement of the camera
      if(this.keyboard.KeyD) {
        camera.translate(5, 0)
        drawScene(grid, ctx, camera, Config.uiConfig)
      }
      if(this.keyboard.KeyA) {
        camera.translate(-5, 0)
        drawScene(grid, ctx, camera, Config.uiConfig)
      }
      if(this.keyboard.KeyW) {
        camera.translate(0, -5)
        drawScene(grid, ctx, camera, Config.uiConfig)
      }
      if(this.keyboard.KeyS) {
        camera.translate(0, 5)
        drawScene(grid, ctx, camera, Config.uiConfig)
      }
    }, 16.67)
  }
}

module.exports = {
  Controller: Controller,
}