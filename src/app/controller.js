"use strict";
require('./eclipse');
require('./camera');
require('./drawing');
require('./grid');
// FIXME: Redo input handling
class Controller {
    constructor(grid, ctx, camera, doc) {
        this.pointPlacementRadius = 0;
        this.pointPlacementColor = Eclipse.Color.BLACK;
        this.keyboard = new Eclipse.KeyBoard();
        this.mouse = new Eclipse.Mouse(doc);
        setInterval(() => {
            // Movement of the camera
            if (this.keyboard.KeyD) {
                camera.translate(5, 0);
                drawScene(grid, ctx, camera, ConfigObject);
            }
            if (this.keyboard.KeyA) {
                camera.translate(-5, 0);
                drawScene(grid, ctx, camera, ConfigObject);
            }
            if (this.keyboard.KeyW) {
                camera.translate(0, -5);
                drawScene(grid, ctx, camera, ConfigObject);
            }
            if (this.keyboard.KeyS) {
                camera.translate(0, 5);
                drawScene(grid, ctx, camera, ConfigObject);
            }
        }, 16.67);
    }
}
module.exports = {
    Controller: Controller,
};
