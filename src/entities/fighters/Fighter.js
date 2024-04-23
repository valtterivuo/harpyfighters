import { FighterState } from "../../constants/fighter.js";
import { STAGE_FLOOR } from "../../constants/stage.js";

export class Fighter {
    constructor(name, x, y, direction) {
        this.name = name;
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.initialVelocity = {};
        this.direction = direction;
        this.gravity = 0;
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animations = {};
        this.image = new Image();
        this.frames = new Map();
        

        this.states = {
            [FighterState.IDLES]: {
                init: this.handleIdlesInit.bind(this),
                update: () => { },
                validFrom: [
                    undefined,
                    FighterState.IDLES, FighterState.WALKS, FighterState.BACKWARDS,
                    FighterState.JUMPS, FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD,
                    FighterState.CROUCH_UP,
                ],
            },
            [FighterState.WALKS]: {
                init: this.handleMoveInit.bind(this),
                update: () => { },
                validFrom: [
                    FighterState.IDLES, FighterState.WALKS,
                ],
            },
            [FighterState.BACKWARDS]: {
                init: this.handleMoveInit.bind(this),
                update: () => { },
                validFrom: [
                    FighterState.IDLES, FighterState.BACKWARDS,
                ],
            },
            [FighterState.JUMPS]: {
                init: this.handleJumpInit.bind(this),
                update: this.handleJumpState.bind(this),
                validFrom: [
                    FighterState.IDLES
                ],
            },
            [FighterState.JUMP_FORWARD]: {
                init: this.handleJumpInit.bind(this),
                update: this.handleJumpState.bind(this),
                validFrom: [
                    FighterState.IDLES, FighterState.WALKS,
                ],
            },
            [FighterState.JUMP_BACKWARD]: {
                init: this.handleJumpInit.bind(this),
                update: this.handleJumpState.bind(this),
                validFrom: [
                    FighterState.IDLES, FighterState.BACKWARDS,
                ],
            },
            [FighterState.CROUCH]: {
                init: () => { },
                update: () => { },
                validFrom: [
                    FighterState.CROUCH_DOWN,
                ],
            },
            [FighterState.CROUCH_DOWN]: {
                init: () => { },
                update: this.handleCrouchDownState.bind(this),
                validFrom: [
                    FighterState.IDLES, FighterState.BACKWARDS, FighterState.WALKS,
                ],
            },
            [FighterState.CROUCH_UP]: {
                init: () => { },
                update: this.handleCrouchUpState.bind(this),
                validFrom: [
                    FighterState.CROUCH,
                ],
            },
        };

        
        this.changeState(FighterState.IDLES);
    }

    changeState(newState) {
        if (newState === this.currentState
            || !this.states[newState].validFrom.includes(this.currentState)) return;

        this.currentState = newState;
        this.animationFrame = 0;

        this.states[this.currentState].init();
    }

    handleIdlesInit() {
        this.velocity.x = 0;
        this.velocity.y = 0;
    }

    handleMoveInit() {
        this.velocity.x = this.initialVelocity.x[this.currentState] ?? 0;
    }

    handleJumpInit() {
        this.velocity.y = this.initialVelocity.jump;
        this.handleMoveInit();
    }

    handleCrouchDownState() {
        if (this.animations[this.currentState][this.animationFrame][1] === -2) {
            this.changeState(FighterState.CROUCH)
        }
    }

    handleCrouchUpState() {
        if (this.animations[this.currentState][this.animationFrame][1] === -2) {
            this.changeState(FighterState.IDLES)
        }
    }

    handleJumpState(time) {
        this.velocity.y += this.gravity * time.secondsPassed;

        if (this.position.y > STAGE_FLOOR) {
            this.position.y = STAGE_FLOOR;
            this.changeState(FighterState.IDLES);
        }
    }

    updateStageConstraints(context) {
        const WIDTH = 32;

        if (this.position.x > context.canvas.width - WIDTH) {
            this.position.x = context.canvas.width - WIDTH; 
        } else if (this.position.x < WIDTH) {
            this.position.x = WIDTH; 
        }

    }

    updateAnimation(time) {
        const animation = this.animations[this.currentState];
        const [, frameDelay] = animation[this.animationFrame];

        if (time.previous > this.animationTimer + frameDelay) {
            this.animationTimer = time.previous;

            if (frameDelay > 0) {
            this.animationFrame++;
            }

            if (this.animationFrame >= animation.length) {
                this.animationFrame = 0;
            }
        }
    }


    update(time, context) {
        this.position.x += (this.velocity.x * this.direction) * time.secondsPassed;
        this.position.y += this.velocity.y * time.secondsPassed;

        this.states[this.currentState].update(time, context);
        this.updateAnimation(time);
        this.updateStageConstraints(context);
    }

    drawDebug(context) {
        context.lineWidth = 1;

        context.beginPath();
        context.strokeStyle = 'white';
        context.moveTo(Math.floor(this.position.x) - 4.5, Math.floor(this.position.y));
        context.lineTo(Math.floor(this.position.x) + 4.5, Math.floor(this.position.y));
        context.moveTo(Math.floor(this.position.x), Math.floor(this.position.y) -4.5);
        context.lineTo(Math.floor(this.position.x), Math.floor(this.position.y) +4.5);
        context.stroke();
    }

    draw(context) {
        const [frameKey] = this.animations[this.currentState][this.animationFrame];
        const [
            [x, y, width, height],
            [originX, originY],
        ] = this.frames.get(frameKey);

        context.scale(this.direction, 1);
        context.drawImage(
            this.image,
            x,y,
            width, height,
            Math.floor(this.position.x * this.direction) - originX, Math.floor(this.position.y) - originY,
            width, height
        );
        context.setTransform(1, 0, 0, 1, 0, 0);

        this.drawDebug(context);

    } 
}