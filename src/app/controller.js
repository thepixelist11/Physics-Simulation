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
        this.keyboard = new Eclipse.KeyBoard(doc);
        this.mouse = new Eclipse.Mouse(doc);
        setInterval(() => {
            if (this.keyboard.KeyD && !this.keyboard.ctrlDown) {
                camera.translate(this.keyboard.shiftDown ? 15 : 5, 0);
                drawScene(grid, ctx, camera, ConfigObject);
            }
            if (this.keyboard.KeyA && !this.keyboard.ctrlDown) {
                camera.translate(this.keyboard.shiftDown ? -15 : -5, 0);
                drawScene(grid, ctx, camera, ConfigObject);
            }
            if (this.keyboard.KeyW && !this.keyboard.ctrlDown) {
                camera.translate(0, this.keyboard.shiftDown ? -15 : -5);
                drawScene(grid, ctx, camera, ConfigObject);
            }
            if (this.keyboard.KeyS && !this.keyboard.ctrlDown) {
                camera.translate(0, this.keyboard.shiftDown ? 15 : 5);
                drawScene(grid, ctx, camera, ConfigObject);
            }
        }, 16.67);
    }
}
module.exports = {
    Controller: Controller,
};
