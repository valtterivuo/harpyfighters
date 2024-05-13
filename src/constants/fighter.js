export const PUSH_FRICTION = 100;

export const FighterDirection = {
    LEFT: -1,
    RIGHT: 1,
};

export const FighterId = {
    HARPY: 'Harpy',
    BIRD: 'Bird',
};

export const FighterAttackType = {
    PUNCH: 'punch',
    KICK: 'kick',
};

export const FighterAttackStrength = {
    LIGHT: 'light',
    HEAVY: 'heavy',
};

export const FighterAttackBaseData = {
    [FighterAttackStrength.LIGHT]: {
        damage: 60,
    },
    [FighterAttackStrength.HEAVY]: {
        damage: 100,
    },
}

export const FighterState = {
    IDLES: 'idles',
    WALKS: 'walks',
    BACKWARDS: 'backward',
    JUMP_START: 'jumpStart',
    JUMPS: 'jumps',
    JUMP_LAND: 'jumpLand',
    JUMP_FORWARD: 'jumpF',
    JUMP_BACKWARD: 'jumpB',
    CROUCH: 'crouch',
    CROUCH_DOWN: 'crouchD',
    CROUCH_UP: 'crouchU',
    PUNCH: 'punch',
    KICK: 'kick',
    HEAVY_KICK: 'heavyKick',
};

export const FrameDelay = {
    FREEZE: 0,
    TRANSITION: -1,
};

export const PushBox = {
    IDLES: [-70, -430, 150, 420],
    JUMPS: [-70, -350, 150, 350],
    BEND: [-70, -260, 150, 260],
    CROUCH: [-70, -250, 150, 250],
};

export const HurtBox = {
    IDLE: [[-130, -230, 250, 230], [-100, -360, 200, 130], [-60, -430, 70, 70]],
    WALKS: [[-100, -230, 200, 230], [-100, -360, 200, 130], [-60, -430, 70, 70]],
    JUMPS: [[-100, -180, 200, 180], [-75, -320, 130, 140], [-50, -380, 75, 60]],
    BEND: [[-60, -135, 130, 135], [-45, -220, 105, 85], [-100, -280, 60, 60]],
    CROUCH: [[-70, -120, 135, 120], [-65, -190, 110, 70], [-20, -250, 55, 60]],
    KICK: [[-50, -235, 90, 235], [-45, -355, 80, 120], [-10, -420, 70, 70]],
    LEANBACK: [[-70, -290, 200, 290], [85, -385, 90, 95], [120, -445, 60, 60]],
    JUMPF: [[-180, -290, 260, 290], [-95, -415, 100, 125], [-90, -490, 70, 75]],
}