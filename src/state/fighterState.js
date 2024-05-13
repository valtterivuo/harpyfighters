import { HEALTH_MAX_HIT_POINTS } from "../constants/battle.js";

export const createDefaultFighterState = (id) => ({
    id,
    hitPoints: HEALTH_MAX_HIT_POINTS,
});