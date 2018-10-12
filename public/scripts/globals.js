
// ENUMS

var gameState = { "start": 1, "level": 2, "boosts": 3, "win": 4, "lose": 5 };
Object.freeze(gameState);

var levelState = { "init": 1, "ready": 2, "play": 3, "end": 4 };
Object.freeze(levelState);

var playerState = { "init": 1, "ready": 2, "alive": 3, "dead": 4 };
Object.freeze(playerState);

// CONSTANTS

var motionUnit = 1.0;