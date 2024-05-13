import { Fighter } from './Fighter.js';
import { FighterState, FrameDelay, HurtBox, PushBox } from '../../constants/fighter.js';

export class Harpy extends Fighter {
    constructor(x, y, direction, platerId) {
        super('Harpy', x , y, direction, platerId);

        this.image = document.querySelector('img[alt="harpy"]')

        this.frames = new Map([   
            // idle
            ['idle-1', [[[167, 3205, 401, 474], [197, 471]], PushBox.IDLES, HurtBox.IDLE]],
            ['idle-2', [[[840, 3194, 404, 485], [219, 483]], PushBox.IDLES, HurtBox.IDLE]],
            ['idle-3', [[[1529, 3193, 403, 485], [224, 483]], PushBox.IDLES, HurtBox.IDLE]],
            ['idle-4', [[[2239, 3199, 404, 479], [203, 476]], PushBox.IDLES, HurtBox.IDLE]],
            ['idle-5', [[[151, 3890, 484, 480], [224, 477]], PushBox.IDLES, HurtBox.IDLE]],
            ['idle-6', [[[858, 3892, 442, 478], [211, 475]], PushBox.IDLES, HurtBox.IDLE]],
            ['idle-7', [[[1564, 3892, 403, 478], [192, 473]], PushBox.IDLES, HurtBox.IDLE]],

            // move forwards
            ['walk-1', [[[175, 4817, 508, 594], [238, 474]], PushBox.IDLES, HurtBox.WALKS]],
            ['walk-2', [[[867, 4817, 394, 475], [252, 473]], PushBox.IDLES, HurtBox.WALKS]],
            ['walk-3', [[[1557, 4814, 416, 478], [246, 477]], PushBox.IDLES, HurtBox.WALKS]],
            ['walk-4', [[[2264, 4815, 409, 477], [223, 475]], PushBox.IDLES, HurtBox.WALKS]],
            ['walk-5', [[[206, 5511, 402, 472], [187, 471]], PushBox.IDLES, HurtBox.WALKS]],
            ['walk-6', [[[946, 5509, 383, 473], [141, 471]], PushBox.IDLES, HurtBox.WALKS]],
            ['walk-7', [[[1652, 5508, 342, 477], [133, 475]], PushBox.IDLES, HurtBox.WALKS]],
            ['walk-8', [[[2298, 5511, 366, 474], [186, 471]], PushBox.IDLES, HurtBox.WALKS]],

            // move backwards
            ['backward-1', [[[2298, 5511, 366, 474], [186, 471]], PushBox.IDLES, HurtBox.WALKS]],
            ['backward-2', [[[1652, 5508, 342, 477], [133, 475]], PushBox.IDLES, HurtBox.WALKS]],
            ['backward-3', [[[946, 5509, 383, 473], [141, 471]], PushBox.IDLES, HurtBox.WALKS]],
            ['backward-4', [[[206, 5511, 402, 472], [187, 471]], PushBox.IDLES, HurtBox.WALKS]],
            ['backward-5', [[[2264, 4815, 409, 477], [223, 475]], PushBox.IDLES, HurtBox.WALKS]],
            ['backward-6', [[[1557, 4814, 416, 478], [246, 477]], PushBox.IDLES, HurtBox.WALKS]],
            ['backward-7', [[[867, 4817, 394, 475], [252, 473]], PushBox.IDLES, HurtBox.WALKS]],
            ['backward-8', [[[175, 4817, 508, 594], [238, 474]], PushBox.IDLES, HurtBox.WALKS]],

            // jump start
            ['jumpS-1', [[[155, 240, 430, 450], [216, 447]], PushBox.IDLES, HurtBox.IDLE]],
            ['jumpS-2', [[[768, 173, 560, 516], [293, 514]], PushBox.IDLES, HurtBox.IDLE]],
            ['jumpS-3', [[[1443, 130, 583, 557], [308, 553]], PushBox.IDLES, HurtBox.IDLE]],

            // jump
            ['jump-1', [[[2229, 131, 425, 493], [221, 489]], PushBox.JUMPS, HurtBox.IDLE]],
            ['jump-2', [[[160, 822, 420, 493], [220, 486]], PushBox.JUMPS, HurtBox.IDLE]],
            ['jump-3', [[[806, 837, 530, 453], [269, 446]], PushBox.JUMPS, HurtBox.JUMPS]],
            ['jump-4', [[[1498, 846, 542, 416], [248, 409]], PushBox.JUMPS, HurtBox.JUMPS]],
            ['jump-5', [[[2256, 733, 373, 550], [168, 546]], PushBox.JUMPS, HurtBox.JUMPS]],
            ['jump-6', [[[177, 1419, 376, 555], [171, 549]], PushBox.JUMPS, HurtBox.JUMPS]],
            ['jump-7', [[[871, 1420, 367, 554], [171, 551]], PushBox.JUMPS, HurtBox.JUMPS]],
            ['jump-8', [[[1566, 1411, 367, 663], [164, 651]], PushBox.JUMPS, HurtBox.JUMPS]],

            // jump land
            ['jumpL-1', [[[2154, 1637, 510, 435], [287, 432]], PushBox.IDLES, HurtBox.IDLE]],
            ['jumpL-2', [[[173, 2407, 446, 354], [199, 350]], PushBox.IDLES, HurtBox.IDLE]],
            ['jumpL-3', [[[901, 2326, 376, 434], [161, 429]], PushBox.IDLES, HurtBox.IDLE]],

            // forward jump
            ['jumpF-1', [[[2226, 8651, 453, 519], [197, 513]], PushBox.JUMPS, HurtBox.JUMPF]],
            ['jumpF-2', [[[152, 9342, 460, 520], [197, 513]], PushBox.JUMPS, HurtBox.JUMPF]],
            ['jumpF-3', [[[802, 9368, 550, 421], [253, 411]], PushBox.JUMPS, HurtBox.JUMPS]],
            ['jumpF-4', [[[1491, 9368, 545, 414], [248, 409]], PushBox.JUMPS, HurtBox.JUMPS]],
            ['jumpF-5', [[[2251, 9254, 372, 549], [166, 545]], PushBox.JUMPS, HurtBox.JUMPS]],
            ['jumpF-6', [[[173, 9940, 376, 554], [170, 550]], PushBox.JUMPS, HurtBox.JUMPS]],
            ['jumpF-7', [[[865, 9941, 368, 553], [171, 550]], PushBox.JUMPS, HurtBox.JUMPS]],
            ['jumpF-8', [[[1560, 9931, 370, 660], [164, 653]], PushBox.JUMPS, HurtBox.JUMPS]],

            // backward jump
            ['jumpB-1', [[[2179, 11856, 437, 487], [197, 513]], PushBox.JUMPS, HurtBox.LEANBACK]],
            ['jumpB-2', [[[115, 12548, 429, 487], [184, 471]], PushBox.JUMPS, HurtBox.LEANBACK]],
            ['jumpB-3', [[[824, 12586, 485, 473], [164, 467]], PushBox.JUMPS, HurtBox.LEANBACK]],
            ['jumpB-4', [[[1511, 12561, 543, 414], [248, 409]], PushBox.JUMPS, HurtBox.JUMPS]],
            ['jumpB-5', [[[2270, 12448, 373, 549], [168, 546]], PushBox.JUMPS, HurtBox.JUMPS]],
            ['jumpB-6', [[[194, 13134, 373, 555], [171, 549]], PushBox.JUMPS, HurtBox.JUMPS]],
            ['jumpB-7', [[[885, 13134, 387, 554], [171, 551]], PushBox.JUMPS, HurtBox.JUMPS]],
            ['jumpB-8', [[[1579, 13124, 368, 663], [164, 651]], PushBox.JUMPS, HurtBox.JUMPS]],

            // crouch
            ['crouch-1', [[[128, 6534, 396, 379], [252, 376]], PushBox.IDLES, HurtBox.IDLE]],
            ['crouch-2', [[[795, 6594, 376, 318], [262, 316]], PushBox.BEND, HurtBox.BEND]],
            ['crouch-3', [[[1513, 6623, 331, 290], [228, 287]], PushBox.CROUCH, HurtBox.CROUCH]],
            ['crouch-4', [[[2218, 6628, 314, 285], [215, 282]], PushBox.CROUCH, HurtBox.CROUCH]],
            ['crouch-5', [[[167, 7310, 291, 294], [192, 291]], PushBox.CROUCH, HurtBox.CROUCH]],
            ['crouch-6', [[[843, 7310, 307, 294], [207, 292]], PushBox.CROUCH, HurtBox.CROUCH]],
            ['crouch-7', [[[1518, 7314, 321, 290], [223, 288]], PushBox.CROUCH, HurtBox.CROUCH]],
            ['crouch-8', [[[2191, 7317, 346, 287], [241, 285]], PushBox.CROUCH, HurtBox.CROUCH]],
            ['crouch-9', [[[105, 8006, 368, 290], [254, 287]], PushBox.CROUCH, HurtBox.CROUCH]],
            ['crouch-10', [[[823, 8004, 331, 292], [228, 289]], PushBox.CROUCH, HurtBox.CROUCH]],

            // kick
            ['kick-1', [[[193, 14969, 357, 462], [184, 461]], PushBox.IDLES, HurtBox.KICK]],
            ['kick-2', [[[896, 14969, 383, 460], [131, 457]], PushBox.IDLES, HurtBox.KICK]],
            ['kick-3', [[[1544, 14951, 433, 478], [125, 474]], PushBox.IDLES, HurtBox.KICK, [-120, -270, 80, 90]]],
            ['kick-4', [[[2206, 14908, 453, 521], [147, 517]], PushBox.IDLES, HurtBox.KICK, [-135, -300, 100, 90]]],
            ['kick-5', [[[152, 15643, 477, 479], [141, 473]], PushBox.IDLES, HurtBox.KICK]],
            ['kick-6', [[[832, 15656, 483, 464], [186, 461]], PushBox.IDLES, HurtBox.KICK]],
            ['kick-7', [[[1552, 15654, 407, 469], [200, 466]], PushBox.IDLES, HurtBox.KICK]],

            // heavy kick
            ['heavyKick-1', [[[198, 16579, 422, 448], [163, 446]], PushBox.IDLES, HurtBox.KICK]],
            ['heavyKick-2', [[[850, 16574, 443, 453], [125, 448]], PushBox.IDLES, HurtBox.KICK, [-120, -230, 75, 90]]],
            ['heavyKick-3', [[[1511, 16575, 453, 451], [158, 446]], PushBox.IDLES, HurtBox.KICK, [-155, -340, 120, 160]]],
            ['heavyKick-4', [[[2225, 16406, 385, 620], [133, 615]], PushBox.IDLES, HurtBox.KICK, [-110, -615, 120, 380]]],
            ['heavyKick-5', [[[152, 17100, 396, 617], [125, 611]], PushBox.IDLES, HurtBox.KICK, [-110, -615, 120, 380]]],
            ['heavyKick-6', [[[806, 17189, 462, 528], [165, 521]], PushBox.IDLES, HurtBox.KICK]],
            ['heavyKick-7', [[[1609, 17258, 389, 459], [58, 456]], PushBox.IDLES, HurtBox.KICK]],
            ['heavyKick-8', [[[2298, 17259, 399, 458], [131, 454]], PushBox.IDLES, HurtBox.KICK]],

        ]);
            
        this.animations = {
            [FighterState.IDLES]: [
                ['idle-1', 110], ['idle-2', 110], ['idle-3', 110], ['idle-4', 110], 
                ['idle-5', 110], ['idle-6', 110], ['idle-7', 110],
            ],
            [FighterState.WALKS] : [
                ['walk-1', 110], ['walk-2', 110], ['walk-3', 110], ['walk-4', 110], 
                ['walk-5', 110], ['walk-6', 110], ['walk-7', 110], ['walk-8', 110],
            ],
            [FighterState.BACKWARDS] : [
                ['backward-1', 110], ['backward-2', 110], ['backward-3', 110], ['backward-4', 110], 
                ['backward-5', 110], ['backward-6', 110], ['backward-7', 110], ['backward-8', 110],
            ],
            [FighterState.JUMP_START]: [
                ['jumpS-1', 60], ['jumpS-2', 60], ['jumpS-3', 60], ['jumpS-3', FrameDelay.TRANSITION]
            ],
            [FighterState.JUMPS] : [
                ['jump-1', 150], ['jump-2', 150], ['jump-3', 150], ['jump-4', 150],
                ['jump-5', 150], ['jump-6', 150], ['jump-7', 150], ['jump-8', 150], 
                ['jump-8', -1],
            ],
            [FighterState.JUMP_LAND]: [
                ['jumpL-1', 110], ['jumpL-2', 110], ['jumpL-3', 110], ['jumpL-3', FrameDelay.TRANSITION]
            ],
            [FighterState.JUMP_FORWARD] : [
                ['jumpF-1', 150], ['jumpF-2', 150], ['jumpF-3', 150], ['jumpF-4', 150],
                ['jumpF-5', 150], ['jumpF-6', 150], ['jumpF-7', 150], ['jumpF-8', 150], 
                ['jumpF-8', FrameDelay.FREEZE],
            ],
            [FighterState.JUMP_BACKWARD] : [
                ['jumpB-1', 150], ['jumpB-2', 150], ['jumpB-3', 150], ['jumpB-4', 150],
                ['jumpB-5', 150], ['jumpB-6', 150], ['jumpB-7', 150], ['jumpB-8', 150], 
                ['jumpB-8', FrameDelay.FREEZE],
            ],
            [FighterState.CROUCH] : [
                ['crouch-4', 150], ['crouch-5', 150], ['crouch-6', 150], ['crouch-7', 150], ['crouch-8', 150],
                ['crouch-9', 150],['crouch-10', 150],
            ],
            [FighterState.CROUCH_DOWN] : [
                ['crouch-1', 100], ['crouch-2', 100], ['crouch-3', 100], ['crouch-3', FrameDelay.TRANSITION],
            ],
            [FighterState.CROUCH_UP] : [
                ['crouch-3', 100], ['crouch-2', 100], ['crouch-1', 100], ['crouch-1', FrameDelay.TRANSITION],
            ],
            [FighterState.KICK] : [
                ['kick-1', 100], ['kick-2', 100], ['kick-3', 100], ['kick-4', 100],
                ['kick-5', 100], ['kick-6', 100], ['kick-7', 100], ['kick-7', FrameDelay.TRANSITION], 
            ],
            [FighterState.HEAVY_KICK] : [
                ['heavyKick-1', 100], ['heavyKick-2', 100], ['heavyKick-3', 100], ['heavyKick-4', 100],
                ['heavyKick-5', 100], ['heavyKick-6', 100], ['heavyKick-7', 100], ['heavyKick-8', 100],
                ['heavyKick-8', FrameDelay.TRANSITION], 
            ],
        };


        this.initialVelocity = {
        x: {
            [FighterState.WALKS]: -500,
            [FighterState.BACKWARDS]: 350,
            [FighterState.JUMP_FORWARD]: -450,
            [FighterState.JUMP_BACKWARD]: 450,
        },
        jump: -2000,
    };
        this.gravity = 4000;
    }
}

