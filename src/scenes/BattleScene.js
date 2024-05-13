import { Stage } from "../entities/Stage";
import { Bird } from "../entities/fighters/Bird";
import { Harpy } from "../entities/fighters/Harpy";

export class BattleScene {
    fighters = [];

    constructor () {
        this.stage = new Stage();

        this.overlays = [
            new StatusBar(this.fighters),
            new FpsCounter(),
        ];

        this.fighters = this.getFighterEntities();
    }

    getFighterEntities() {
        const fighterEntities = [new Harpy(0), new Bird(1)];

        this.fighters[0].opponent = this.fighters[1];
        this.fighters[1].opponent = this.fighters[0];

        return fighterEntities;
    }

    updateFighters(time, context) {
        for (const fighter of this.fighters) {
            fighter.update(time, context);
        }
    }

    updateEntities(time, context) {
        for (const entity of this.entities) {
            entity.update(time, context);
        }
    }

    updateOverlays(time, context) {
        for (const overlay of this.overlays) {
            overlay.update(time, context);
        }
    }

    update(time, context) {
        this.updateFighters(time, context);
        this.updateEntities(time, context);
        this.updateOverlays(time, context);
    }

    drawFighters(context) {
        for (const fighter of this.fighters) {
            fighter.draw(context);
        }
    }

    drawEntities(context) {
        for (const entity of this.entities) {
            entity.draw(context);
        }
    }

    drawOverlays(time, context) {
        for (const overlay of this.overlays) {
            overlay.update(time, context);
        }
    }


    draw(context) {
        this.drawFighters(context);
        this.drawEntities(context);
        this.drawOverlays(context);
    }
}