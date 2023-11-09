"use strict";
require('./eclipse');
require('./camera');
require('./drawing');
require('./grid');
// FIXME: Redo input handling
class Controller {
    constructor(grid, ctx, camera) {
        const keyboard = new Eclipse.KeyBoard();
        setInterval(() => {
            if (keyboard.KeyD) {
                camera.translate(5, 0);
                drawScene(grid, ctx, camera);
            }
            if (keyboard.KeyA) {
                camera.translate(-5, 0);
                drawScene(grid, ctx, camera);
            }
            if (keyboard.KeyW) {
                camera.translate(0, -5);
                drawScene(grid, ctx, camera);
            }
            if (keyboard.KeyS) {
                camera.translate(0, 5);
                drawScene(grid, ctx, camera);
            }
        }, 16.67);
    }
}
module.exports = {
    Controller: Controller,
};
