import { HEALTH_DAMAGE_COLOR, HEALTH_MAX_HIT_POINTS } from "../../constants/battle.js";
import { gameState } from "../../state/gameState.js";

export class StatusBar {
    constructor() {
        this.image = document.querySelector('img[alt="fonts"]');

        this.time = 99;
        this.timeTimer = 0;

        this.healthBars = [{
            timer: 0,
            hitPoints: HEALTH_MAX_HIT_POINTS,
        }, {
            timer: 0,
            hitPoints: HEALTH_MAX_HIT_POINTS,
        }];

        this.frames = new Map([
            ['health-bar', [32, 832, 673, 146]],

            ['time-1', [597, 409, 18, 44]],
            ['time-2', [617, 409, 39, 44]],
            ['time-3', [657, 409, 39, 44]],
            ['time-4', [697, 409, 39, 44]],
            ['time-5', [737, 409, 39, 44]],
            ['time-6', [779, 409, 38, 44]],
            ['time-7', [819, 409, 39, 44]],
            ['time-8', [860, 409, 38, 44]],
            ['time-9', [900, 409, 39, 44]],
            ['time-0', [941, 409, 38, 44]],
            
        ]);
    }

    drawFrame(context, frameKey, x, y, direction = 1){
        const [sourceX, sourceY, sourceWidth, sourceHeight] = this.frames.get(frameKey);

        context.scale(direction, 1);
        context.drawImage(
            this.image,
            sourceX, sourceY, sourceWidth, sourceHeight,
            x * direction, y, sourceWidth, sourceHeight,
        );
        context.setTransform(1, 0, 0, 1, 0, 0);
    }

    updateTime(time) {
        if (time.previous > this.timeTimer + 1000) {
            this.time -= 1;
            this.timeTimer = time.previous;
        }
    }

    updateHealthBars(time) {
        for (const index in this.healthBars) {
            if (this.healthBars[index].hitPoints <= gameState.fighters[index].hitPoints) continue;
            this.healthBars[index].hitPoints = Math.max(0, this.healthBars[index].hitPoints - (time.secondsPassed * 144));
        }
    }

    checkGameEnd() {
        // Check if the timer or any fighter's hit points have reached zero
        const timerExpired = this.time <= 0;
        const fighterHealthDepleted = this.healthBars.some(bar => bar.hitPoints <= 0);
    
        // If either condition is true, end the game
        if (timerExpired || fighterHealthDepleted) {
            // Add logic to end the game here, such as displaying game over screen or resetting the game
            console.log("Game Over!");
        }
    }
    
    update(time) {
        this.updateTime(time);
        this.updateHealthBars(time);
        this.checkGameEnd();
    }

    drawHealthBars(context) {
        this.drawFrame(context, 'health-bar', 200, 60);
        this.drawFrame(context, 'health-bar', 1700, 60, -1);

        context.fillStyle = HEALTH_DAMAGE_COLOR;

        context.beginPath();
        context.fillRect(
            210, 71,
            HEALTH_MAX_HIT_POINTS - Math.floor(this.healthBars[0].hitPoints), 124,
        );

        context.fillRect(
            1038 + Math.floor(this.healthBars[1].hitPoints), 71,
            HEALTH_MAX_HIT_POINTS - Math.floor(this.healthBars[1].hitPoints), 124,

        );
    }

    drawTime(context) {
        const timeString = String(Math.max(this.time, 0)).padStart(2, '00');

        this.drawFrame(context, `time-${timeString.charAt(0)}`, 910, 105);
        this.drawFrame(context, `time-${timeString.charAt(1)}`, 955, 105);
    }

    draw(context) {
        this.drawHealthBars(context);
        this.drawTime(context);
    }
}