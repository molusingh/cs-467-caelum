// ENUMS

//Note: these are 'external states', internal representations can have more

var gameState = { "start": 1, "level": 2, "boosts": 3, "win": 4, "lose": 5 };
Object.freeze(gameState);

var levelState = { "init": 1, "ready": 2, "play": 3, "end": 4 };
Object.freeze(levelState);

var playerState = { "init": 1, "ready": 2, "alive": 3, "dead": 4 };
Object.freeze(playerState);

var ducklingState = { "init": 1, "ready": 2, "egg": 3, "duckling": 4, "dead": 5 };
Object.freeze(playerState);

var hawkState = { "init": 1, "ready": 2, "alive": 3, "stun": 4 };
Object.freeze(playerState);

var croqState = { "init": 1, "ready": 2, "alive": 3, "stun": 4 };
Object.freeze(playerState);

var foxState = { "init": 1, "ready": 2, "alive": 3, "stun": 4 };
Object.freeze(playerState);

var componentType = {
    "land": 1, "water": 2, "obstacle": 3, "fox": 4, "hawk": 5, "croq": 6,
    "duck": 7, "duckling": 7, "egg": 8
};
Object.freeze(playerState);

// CONSTANTS

var motionUnit = 1.0;

