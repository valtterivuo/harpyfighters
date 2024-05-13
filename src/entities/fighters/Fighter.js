import { Control } from "../../constants/control.js";
import { 
    FighterDirection, 
    FighterState, FrameDelay, 
    FighterAttackType, 
    PUSH_FRICTION, 
    FighterAttackStrength,
    FighterAttackBaseData
} from "../../constants/fighter.js";
import { STAGE_FLOOR } from "../../constants/stage.js";
import * as control from '../../InputHandler.js';
import { gameState } from "../../state/gameState.js";
import { boxOverlap, getActualBoxDimensions, rectsOverlap } from "../../utils/collision.js";

export class Fighter {
    constructor(name, x, y, direction, playerId) {
        this.name = name;
        this.playerId = playerId;
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.initialVelocity = {};
        this.direction = direction;
        this.gravity = 0;
        this.attackStruck = false;
        this.frames = new Map();
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animations = {};
        this.image = new Image();
        this.opponent;
        this.boxes = {
            push: { x: 0, y: 0, width: 0, height: 0 },
            hurt: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
            hit: { x: 0, y: 0, width: 0, height: 0 },
        };

        this.states = {
            [FighterState.IDLES]: {
                init: this.handleIdlesInit.bind(this),
                update: this.handleIdlesState.bind(this),
                validFrom: [
                    undefined,
                    FighterState.IDLES, FighterState.WALKS, FighterState.BACKWARDS,
                    FighterState.JUMPS, FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD,
                    FighterState.CROUCH_UP, FighterState.JUMP_LAND, FighterState.KICK,
                    FighterState.HEAVY_KICK,
                ],
            },
            [FighterState.WALKS]: {
                init: this.handleMoveInit.bind(this),
                update: this.handleWalksState.bind(this),
                validFrom: [
                    FighterState.IDLES, FighterState.WALKS,
                ],
            },
            [FighterState.BACKWARDS]: {
                init: this.handleMoveInit.bind(this),
                update: this.handleBackwardsState.bind(this),
                validFrom: [
                    FighterState.IDLES, FighterState.BACKWARDS,
                ],
            },
            [FighterState.JUMP_START]: {
                init: this.handleJumpStartInit.bind(this),
                update: this.handleJumpStartState.bind(this),
                validFrom: [
                    FighterState.IDLES, FighterState.JUMP_LAND, FighterState.WALKS, FighterState.BACKWARDS,
                ],
            },
            [FighterState.JUMPS]: {
                init: this.handleJumpInit.bind(this),
                update: this.handleJumpState.bind(this),
                validFrom: [
                    FighterState.JUMP_START
                ],
            },
            [FighterState.JUMP_FORWARD]: {
                init: this.handleJumpInit.bind(this),
                update: this.handleJumpState.bind(this),
                validFrom: [
                    FighterState.JUMP_START,
                ],
            },
            [FighterState.JUMP_BACKWARD]: {
                init: this.handleJumpInit.bind(this),
                update: this.handleJumpState.bind(this),
                validFrom: [
                    FighterState.JUMP_START,
                ],
            },
            [FighterState.JUMP_LAND]: {
                init: this.handleJumpLandInit.bind(this),
                update: this.handleJumpLandState.bind(this),
                validFrom: [
                    FighterState.JUMPS, FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD,
                ],
            },
            [FighterState.CROUCH]: {
                init: () => { },
                update: this.handleCrouchState.bind(this),
                validFrom: [
                    FighterState.CROUCH_DOWN,
                ],
            },
            [FighterState.CROUCH_DOWN]: {
                init: this.handleCrouchDownInit.bind(this),
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
            [FighterState.KICK]: {
                attackType: FighterAttackType.KICK,
                attackStrength: FighterAttackStrength.LIGHT,
                init: this.handleStandardAttackInit.bind(this),
                update: this.handleKickState.bind(this),
                validFrom:[
                    FighterState.IDLES, FighterState.BACKWARDS, FighterState.WALKS,
                ],
            },
            [FighterState.HEAVY_KICK]: {
                attackType: FighterAttackType.KICK,
                attackStrength: FighterAttackStrength.HEAVY,
                init: this.handleStandardHeavyAttackInit.bind(this),
                update: this.handleHeavyKickState.bind(this),
                validFrom:[
                    FighterState.IDLES, FighterState.BACKWARDS, FighterState.WALKS,
                ],
            },
        };

        
        this.changeState(FighterState.IDLES);
    }

    isAnimationCompleted = () => this.animations[this.currentState][this.animationFrame][1] === FrameDelay.TRANSITION;

    hasCollidedWithOpponent = () => rectsOverlap(
        this.position.x + this.boxes.push.x, this.position.y + this.boxes.push.y,
        this.boxes.push.width, this.boxes.push.height,
        this.opponent.position.x + this.opponent.boxes.push.x, 
        this.opponent.position.y + this.opponent.boxes.push.y,
        this.opponent.boxes.push.width, this.opponent.boxes.push.height,
    );

    resetVelocities() {
        this.velocity = { x:0, y:0 };
    }

    getDirection() {
        if (
            this.position.x + this.boxes.push.x + this.boxes.push.width
            <= this.opponent.position.x + this.opponent.boxes.push.x
        ) {
            return FighterDirection.LEFT;
        } else if (
            this.position.x + this.boxes.push.x
            >= this.opponent.position.x + this.opponent.boxes.push.x + this.opponent.boxes.push.width
        ) {
            return FighterDirection.RIGHT;
        }

        return this.direction;
    }
          

    getBoxes(frameKey) {
        const [,
            [pushX = 0, pushY = 0, pushWidth = 0, pushHeight = 0] = [],
            [head = [0,0,0,0], body = [0,0,0,0], feet = [0,0,0,0]] = [],
            [hitX = 0, hitY = 0, hitWidth = 0, hitHeight = 0] = [],     
        ] = this.frames.get(frameKey);

        return {
            push: {x: pushX , y: pushY , width: pushWidth, height: pushHeight },
            hurt: [head, body, feet],
            hit: {x: hitX , y: hitY , width: hitWidth, height: hitHeight },
        };
    }

    changeState(newState) {
        if (newState === this.currentState
            || !this.states[newState].validFrom.includes(this.currentState)) {
                console.warn(`Illegal transition form "${this.currentState}" to "${newState}`);
            return;
        } 

        this.currentState = newState;
        this.animationFrame = 0;

        this.states[this.currentState].init();
    }

    handleIdlesInit() {
        this.resetVelocities();
        this.attackStruck = false;
    }

    handleMoveInit() {
        this.velocity.x = this.initialVelocity.x[this.currentState] ?? 0;
    }

    handleJumpStartInit() {
        this.resetVelocities();
    }

    handleJumpInit() {
        this.velocity.y = this.initialVelocity.jump;
        this.handleMoveInit();
    }

    handleJumpLandInit() {
        this.resetVelocities();
    }

    handleCrouchDownInit() {
        this.resetVelocities();
    }

    handleStandardAttackInit() {
        this.resetVelocities();
    }

    handleStandardHeavyAttackInit() {
        this.resetVelocities();
    }

    handleIdlesState(){
        if (control.isUp(this.playerId)) {
            this.changeState(FighterState.JUMP_START);
        } else if (control.isDown(this.playerId)) {
            this.changeState(FighterState.CROUCH_DOWN);
        } else if (control.isBackward(this.playerId, this.direction)) {
            this.changeState(FighterState.BACKWARDS);
        } else if (control.isForward(this.playerId, this.direction)) {
            this.changeState(FighterState.WALKS);
        } else if (control.isKick(this.playerId)) {
            this.changeState(FighterState.KICK);
        } else if (control.isHeavyKick(this.playerId)) {
            this.changeState(FighterState.HEAVY_KICK);
        }

        this.direction = this.getDirection();
    }

    handleWalksState(){
        if (!control.isForward(this.playerId, this.direction)) {
            this.changeState(FighterState.IDLES);
        } else if (control.isUp(this.playerId)) {
            this.changeState(FighterState.JUMP_START);
        } else if (control.isDown(this.playerId)) {
            this.changeState(FighterState.CROUCH_DOWN);
        } else if (control.isKick(this.playerId)) {
            this.changeState(FighterState.KICK);
        } else if (control.isHeavyKick(this.playerId)) {
            this.changeState(FighterState.HEAVY_KICK);
        }
        

        this.direction = this.getDirection();
    }

    handleBackwardsState(){
        if (!control.isBackward(this.playerId, this.direction)) {
            this.changeState(FighterState.IDLES);
        } else if (control.isUp(this.playerId)) {
            this.changeState(FighterState.JUMP_START);
        } else if (control.isDown(this.playerId)) {
            this.changeState(FighterState.CROUCH_DOWN);
        } else if (control.isKick(this.playerId)) {
            this.changeState(FighterState.KICK);
        } else if (control.isHeavyKick(this.playerId)) {
            this.changeState(FighterState.HEAVY_KICK);
        }

        this.direction = this.getDirection();
    }

    handleCrouchState() {
        if (!control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_UP);

        this.direction = this.getDirection();
        }
    

    handleCrouchDownState() {
        if (this.isAnimationCompleted()) {
            this.changeState(FighterState.CROUCH)
        }

        if (!control.isDown(this.playerId)) {
            this.currentState = FighterState.CROUCH_UP;
            this.animationFrame = this.animations[FighterState.CROUCH_UP][this.animationFrame].length
                - this.animationFrame;
        }
    }

    handleCrouchUpState() {
        if (this.isAnimationCompleted()) {
            this.changeState(FighterState.IDLES)
        }
    }

    handleJumpStartState() {
        if (this.isAnimationCompleted()) {
            if (control.isBackward(this.playerId, this.direction)) {
                this.changeState(FighterState.JUMP_BACKWARD);
            } else if (control.isForward(this.playerId, this.direction)) {
                this.changeState(FighterState.JUMP_FORWARD);
            } else {
                this.changeState(FighterState.JUMPS);
            }
        }
    }

    handleJumpState(time) {
        this.velocity.y += this.gravity * time.secondsPassed;

        if (this.position.y > STAGE_FLOOR) {
            this.position.y = STAGE_FLOOR;
            this.changeState(FighterState.JUMP_LAND);
        }
    }

    handleJumpLandState() {
        if (this.animationFrame < 1) return;

        let newState = FighterState.IDLES;
    
        if (!control.isIdle(this.playerId)) {
            this.direction = this.getDirection();

            this.handleIdlesState();
        } else {
            this.direction = this.getDirection();      
        if (!this.isAnimationCompleted()) {
            return;
        }
        }

        this.changeState(newState);
    }

    handleKickState() {
        if (!this.isAnimationCompleted()) return;
        this.changeState(FighterState.IDLES);
    }

    handleHeavyKickState() {
        if (!this.isAnimationCompleted()) return;
        this.changeState(FighterState.IDLES);
    }

    updateStageConstraints(time, context) {
        if (this.position.x > context.canvas.width - this.boxes.push.width) {
            this.position.x = context.canvas.width - this.boxes.push.width; 
        }
        
        if (this.position.x < this.boxes.push.width) {
            this.position.x = this.boxes.push.width; 
        }

        if (this.hasCollidedWithOpponent()) {
            if (this.position.x <= this.opponent.position.x) {
                this.position.x = Math.max(
                    (this.opponent.position.x + this.opponent.boxes.push.x) - (this.boxes.push.x + this.boxes.push.width),
                    this.boxes.push.width,
                );
            

            if ([
                FighterState.IDLES, FighterState.CROUCH, FighterState.JUMPS,
                FighterState.JUMP_BACKWARD, FighterState.JUMP_BACKWARD,
            ].includes(this.opponent.currentState)) {
                this.opponent.position.x += PUSH_FRICTION * time.secondsPassed;
            }
        }

            if (this.position.x >= this.opponent.position.x) {
                this.position.x = Math.min(
                    (this.opponent.position.x + this.opponent.boxes.push.x + this.opponent.boxes.push.width)
                    + (this.boxes.push.width + this.boxes.push.x),
                    context.canvas.width - this.boxes.push.width,
                );

                if ([
                    FighterState.IDLES, FighterState.CROUCH, FighterState.JUMPS,
                    FighterState.JUMP_BACKWARD, FighterState.JUMP_BACKWARD,
                ].includes(this.opponent.currentState)) {
                    this.opponent.position.x -= PUSH_FRICTION * time.secondsPassed;
                }
            }
        }

    }

    updateAnimation(time) {
        const animation = this.animations[this.currentState];
        const [, frameDelay] = animation[this.animationFrame];

        if (time.previous <= this.animationTimer + frameDelay) return;
            this.animationTimer = time.previous;

            if (frameDelay <= FrameDelay.FREEZE) return;
            
            this.animationFrame++;
            if (this.animationFrame >= animation.length) this.animationFrame = 0;
            
            
            this.boxes = this.getBoxes(animation[this.animationFrame][0]);
        }

    updateAttackBoxCollided() {
        if (!this.states[this.currentState].attackType || this.attackStruck) return;

        const actualHitBox = getActualBoxDimensions(this.position, this.direction, this.boxes.hit);

        for (const hurt of this.opponent.boxes.hurt) {
            const [x, y, width, height] = hurt;
            const actualOpponentHurtBox = getActualBoxDimensions(
                this.opponent.position,
                this.opponent.direction,
                { x, y, width, height },
            );

            if (!boxOverlap(actualHitBox, actualOpponentHurtBox)) return;

            const hurtIndex = this.opponent.boxes.hurt.indexOf(hurt);
            const hurtName = ['head', 'body', 'feet'];
            const strength = this.states[this.currentState].attackStrength;

            gameState.fighters[this.opponent.playerId].hitPoints -= FighterAttackBaseData[strength].damage;
            
            
            console.log(`${this.name} has hit ${this.opponent.name}'s ${hurtName[hurtIndex]}`);

            this.attackStruck = true;
            return;
        }
    }


    update(time, context) {
        this.position.x += (this.velocity.x * this.direction) * time.secondsPassed;
        this.position.y += this.velocity.y * time.secondsPassed;

        this.states[this.currentState].update(time, context);
        this.updateAnimation(time);
        this.updateStageConstraints(time, context);
        this.updateAttackBoxCollided(time);
    }

    drawDebugBox(context, dimensions, baseColor) {
        if (!Array.isArray(dimensions)) return;

        const [x = 0, y = 0, width = 0, height = 0] = dimensions;

        context.beginPath();
        context.strokeStyle = baseColor + 'AA';
        context.fillStyle = baseColor + '44';
        context.fillRect(
            Math.floor(this.position.x + (x * this.direction)) + 0.5,
            Math.floor(this.position.y + y) + 0.5,
            width * this.direction,
            height,
        );
        context.rect(
            Math.floor(this.position.x + (x * this.direction)) + 0.5,
            Math.floor(this.position.y + y) + 0.5,
            width * this * this.direction,
            height,
        );
        context.stroke();
    }

    /*drawDebug(context) {
        const [frameKey] = this.animations[this.currentState][this.animationFrame];
        const boxes = this.getBoxes(frameKey);

        context.lineWidth = 1;

        // Push Box
        this.drawDebugBox(context, Object.values(boxes.push), '#55FF55');

        // Hurt Box
        for(const hurtBox of boxes.hurt) {
            this.drawDebugBox(context, hurtBox, '#7777FF');
        }

        // Hit Box
        this.drawDebugBox(context, Object.values(boxes.hit), '#FF0000');

        // origin point
        context.beginPath();
        context.strokeStyle = 'white';
        context.moveTo(Math.floor(this.position.x) - 4, Math.floor(this.position.y) - 0.5);
        context.lineTo(Math.floor(this.position.x) + 5, Math.floor(this.position.y) - 0.5);
        context.moveTo(Math.floor(this.position.x) + 0.5, Math.floor(this.position.y) - 5);
        context.lineTo(Math.floor(this.position.x) + 0.5, Math.floor(this.position.y) + 4);
        context.stroke();
    }*/

    draw(context) {
        const [frameKey] = this.animations[this.currentState][this.animationFrame];
        const [[
            [x, y, width, height],
            [originX, originY],
        ]] = this.frames.get(frameKey);

        context.scale(this.direction, 1);
        context.drawImage(
            this.image,
            x,y,
            width, height,
            Math.floor(this.position.x * this.direction) - originX, Math.floor(this.position.y) - originY,
            width, height
        );
        context.setTransform(1, 0, 0, 1, 0, 0);

        //this.drawDebug(context);

    } 
}