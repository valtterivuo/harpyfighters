import { controls } from './config/controls.js';
import { Control } from './constants/control.js';
import { FighterDirection } from './constants/fighter.js';

const heldKeys = new Set();
const pressedKeys = new Set();

const mappedKeys = controls.map(({ keyboard }) => Object.values(keyboard)).flat();

function handleKeyDown(event) {
    if (!mappedKeys.includes(event.code)) return;
    event.preventDefault();
    
    heldKeys.add(event.code);
}

function handleKeyUp(event) {
    if (!mappedKeys.includes(event.code)) return;

    event.preventDefault();
    heldKeys.delete(event.code);
    pressedKeys.delete(event.code);
}

export function registerKeyboardEvents() {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
}

// Control helpers

export const isKeydown = (code) => heldKeys.has(code);
export const isKeyUp = (code) => !heldKeys.has(code);

export function isKeyPressed(code) {
    if (heldKeys.has(code) && !pressedKeys.has(code)) {
        pressedKeys.add(code);
        return true;
    }
}

export const isControlDown = (id, control) => isKeydown(controls[id].keyboard[control]);

export const isControlPressed = (id, control) => isKeyPressed(controls[id].keyboard[control]);

export const isLeft = (id) => isKeydown(controls[id].keyboard[Control.LEFT]);
export const isRight = (id) => isKeydown(controls[id].keyboard[Control.RIGHT]);
export const isUp = (id) => isKeydown(controls[id].keyboard[Control.UP]);
export const isDown = (id) => isKeydown(controls[id].keyboard[Control.DOWN]);

export const isForward = (id,direction) => direction === FighterDirection.LEFT ? isRight(id) : isLeft(id);
export const isBackward = (id,direction) => direction === FighterDirection.RIGHT ? isRight(id) : isLeft(id);

export const isIdle = (id) => !(isLeft(id) || isRight(id) || isUp(id) || isDown(id));

export const isKick = (id) => isControlPressed(id, Control.KICK);
export const isHeavyKick = (id) => isControlPressed(id, Control.HEAVY_KICK);