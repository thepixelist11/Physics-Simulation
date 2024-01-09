require('./eclipse')
require('./camera')
require('./drawing')
require('./grid')

type MovementArrow = Eclipse.Axis | 'both'

class Controller {
  keyboard
  mouse
  pointPlacementRadius = 0
  pointDynamicPlacementColor = Eclipse.Color.BLACK
  pointStaticPlacementColor = Eclipse.Color.BLACK
  selectedPoint: Point | null
  canPlacePoint = true

  selectionArrowHovered: null | MovementArrow = null
  selectionArrowDragged = false
  selectionArrowAxisDragged: null | MovementArrow = null
  selectionArrowOffsetPos: null | Eclipse.Vector2 = null

  velocityDragged = false
  velocityDraggedStartPos: null | Eclipse.Vector2 = null

  constructor(grid: Grid, ctx: CanvasRenderingContext2D, camera: Camera, doc: Document) {
    this.keyboard = new Eclipse.KeyBoard(doc)
    this.mouse = new Eclipse.Mouse(doc)
    this.selectedPoint = null
    
    setInterval(() => {
      if(!(cameraLock && loopPhysics && controller.selectedPoint)) {
        if(this.keyboard.KeyD && !this.keyboard.ctrlDown) {
          camera.translate(this.keyboard.shiftDown ? 15 : 5, 0)
          updateSelectionArrows()
          updateDraggedPointPosition()
          drawScene(grid, ctx, camera, ConfigObject)
        }
        if(this.keyboard.KeyA && !this.keyboard.ctrlDown) {
          camera.translate(this.keyboard.shiftDown ? -15 : -5, 0)
          updateSelectionArrows()
          updateDraggedPointPosition()
          drawScene(grid, ctx, camera, ConfigObject)
        }
        if(this.keyboard.KeyW && !this.keyboard.ctrlDown) {
          camera.translate(0, this.keyboard.shiftDown ? -15 : -5)
          updateSelectionArrows()
          updateDraggedPointPosition()
          drawScene(grid, ctx, camera, ConfigObject)
        }
        if(this.keyboard.KeyS && !this.keyboard.ctrlDown) {
          camera.translate(0, this.keyboard.shiftDown ? 15 : 5)
          updateSelectionArrows()
          updateDraggedPointPosition()
          drawScene(grid, ctx, camera, ConfigObject)
        }
      }
      // if(this.keyboard.Equal && !this.keyboard.ctrlDown) {
      //   camera.changeZoom(this.keyboard.shiftDown ? 0.03 : 0.01)
      //   drawScene(grid, ctx, camera, ConfigObject)
      // }
      // if(this.keyboard.Minus && !this.keyboard.ctrlDown) {
      //   camera.changeZoom(this.keyboard.shiftDown ? -0.03 : -0.01)
      //   drawScene(grid, ctx, camera, ConfigObject)
      // }
    }, 16.67)
  }

  getGlobalMousePosition() {
    return new Eclipse.Vector2(
      (this.mouse.x + mainCam.x) / mainCam.zoom,
      (this.mouse.y + mainCam.y) / mainCam.zoom
    )
  }
}
