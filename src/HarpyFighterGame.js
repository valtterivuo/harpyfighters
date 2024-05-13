import { Harpy} from './entities/fighters/Harpy.js';
import { Bird } from './entities/fighters/Bird.js';
import { Stage } from './entities/Stage.js';
import { FpsCounter } from './entities/overlays/FpsCounter.js';
import { STAGE_FLOOR } from './constants/stage.js';
import { FighterDirection } from './constants/fighter.js';
import { registerKeyboardEvents } from './InputHandler.js';
import { StatusBar } from './entities/overlays/StatusBar.js';

export class HarpyFighterGame {
    constructor(){
        this.context = this.getContext();
        this.fighters = [
            new Harpy(400, STAGE_FLOOR, FighterDirection.LEFT, 0),
            new Bird(1550, STAGE_FLOOR, FighterDirection.RIGHT, 1),
        ];

        this.fighters[0].opponent = this.fighters[1];
        this.fighters[1].opponent = this.fighters[0];
    
        this.entities = [
         new Stage(),
         ...this.fighters,
         new FpsCounter(),
         new StatusBar(this.fighters),
        ];

        this.frameTime = {
            previous: 0,
            secondsPassed: 0,
        };
    }

    getContext() {
        const canvasEl = document.querySelector('canvas');
        const context = canvasEl.getContext('2d');

        return context;
    }

    update() {
        for(const entity of this.entities){
        entity.update(this.frameTime, this.context);
        }
    }   

    draw() {
        for (const entity of this.entities) {
            entity.draw(this.context);
        }
    }

    frame(time) {
        window.requestAnimationFrame(this.frame.bind(this));

        this.frameTime = {
        secondsPassed: (time - this.frameTime.previous) / 1000,
        previous: time,
        }

        this.update();
        this.draw();
    }
      
    start(){
    registerKeyboardEvents();

    window.requestAnimationFrame(this.frame.bind(this));
    }
}