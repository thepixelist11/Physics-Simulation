"use strict";
require('./eclipse');
require('./camera');
require('./drawing');
require('./grid');
class Controller {
    constructor(grid, ctx, camera, doc) {
        this.pointPlacementRadius = 0;
        this.pointDynamicPlacementColor = Eclipse.Color.BLACK;
        this.pointStaticPlacementColor = Eclipse.Color.BLACK;
        this.canPlacePoint = true;
        this.selectionArrowHovered = null;
        this.selectionArrowDragged = false;
        this.selectionArrowAxisDragged = null;
        this.selectionArrowOffsetPos = null;
        this.keyboard = new Eclipse.KeyBoard(doc);
        this.mouse = new Eclipse.Mouse(doc);
        this.selectedPoint = null;
        setInterval(() => {
            if (this.keyboard.KeyD && !this.keyboard.ctrlDown) {
                camera.translate(this.keyboard.shiftDown ? 15 : 5, 0);
                updateSelectionArrows();
                drawScene(grid, ctx, camera, ConfigObject);
            }
            if (this.keyboard.KeyA && !this.keyboard.ctrlDown) {
                camera.translate(this.keyboard.shiftDown ? -15 : -5, 0);
                updateSelectionArrows();
                drawScene(grid, ctx, camera, ConfigObject);
            }
            if (this.keyboard.KeyW && !this.keyboard.ctrlDown) {
                camera.translate(0, this.keyboard.shiftDown ? -15 : -5);
                updateSelectionArrows();
                drawScene(grid, ctx, camera, ConfigObject);
            }
            if (this.keyboard.KeyS && !this.keyboard.ctrlDown) {
                camera.translate(0, this.keyboard.shiftDown ? 15 : 5);
                updateSelectionArrows();
                drawScene(grid, ctx, camera, ConfigObject);
            }
            // if(this.keyboard.Equal && !this.keyboard.ctrlDown) {
            //   camera.changeZoom(this.keyboard.shiftDown ? 0.03 : 0.01)
            //   drawScene(grid, ctx, camera, ConfigObject)
            // }
            // if(this.keyboard.Minus && !this.keyboard.ctrlDown) {
            //   camera.changeZoom(this.keyboard.shiftDown ? -0.03 : -0.01)
            //   drawScene(grid, ctx, camera, ConfigObject)
            // }
        }, 16.67);
    }
    getGlobalMousePosition() {
        return new Eclipse.Vector2((this.mouse.x + mainCam.x) / mainCam.zoom, (this.mouse.y + mainCam.y) / mainCam.zoom);
    }
}
