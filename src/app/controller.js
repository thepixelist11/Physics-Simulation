"use strict";
require('./eclipse');
require('./camera');
require('./drawing');
require('./grid');
// FIXME: Redo input handling
class Controller {
    constructor(grid, ctx, camera, doc) {
        this.keyboard = new Eclipse.KeyBoard();
        this.mouse = new Eclipse.Mouse(doc);
        setInterval(() => {
            // Movement of the camera
            if (this.keyboard.KeyD) {
                camera.translate(5, 0);
                drawScene(grid, ctx, camera, Config.uiConfig);
            }
            if (this.keyboard.KeyA) {
                camera.translate(-5, 0);
                drawScene(grid, ctx, camera, Config.uiConfig);
            }
            if (this.keyboard.KeyW) {
                camera.translate(0, -5);
                drawScene(grid, ctx, camera, Config.uiConfig);
            }
            if (this.keyboard.KeyS) {
                camera.translate(0, 5);
                drawScene(grid, ctx, camera, Config.uiConfig);
            }
            // Zoom of the camera
            if (this.keyboard.NumpadAdd) {
                camera.zoom += 0.01;
                drawScene(grid, ctx, camera, Config.uiConfig);
            }
            if (this.keyboard.NumpadSubtract) {
                camera.zoom -= 0.01;
                drawScene(grid, ctx, camera, Config.uiConfig);
            }
        }, 16.67);
    }
}
module.exports = {
    Controller: Controller,
};
