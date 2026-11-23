
// Bonus level settings
export const BONUS_INTERVAL = 50;
export const BONUS_POINTS = 10;
export const BONUS_TIME = 15;

// Player lane positions
export const LANE_POSITIONS = [40, 160, 280];

// Player car settings
export const PLAYER = {
    y: 420,
    width: 40,
    height: 70
};

// Shared game state
export const gameState = {

    isRunning: false,
    isChallenging: false,

    carLane: 1,
    carPositionX: LANE_POSITIONS[1],

    obstacles: [],

    score: 0,
    frame: 0,

    animationId: null,

    // First bonus challenge appears at 50 points
    nextBonusScore: BONUS_INTERVAL

};
