export class FpsCounter {
    constructor () {
        this.fps = 0;
    }

    update(time) {
        this.fps = Math.trunc(1 / time.secondsPassed);
    }

    draw(context) {
        context.font = "bold 22px Arial"
        context.fillStyle = "green"
        context.textAlign = "right";
        context.fillText(`${this.fps}`, context.canvas.width - 2, context.canvas.height - 2);
    }
}
