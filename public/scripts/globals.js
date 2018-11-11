/* global EventBus*/
// ENUMS

//Note: these are 'external states', internal representations can have more

var gameState = { "start": 1, "level": 2, "boosts": 3, "win": 4, "loss": 5 };
Object.freeze(gameState);

var levelState = {
	"init": 1, "preGame": 2, "build": 3, "ready": 4, "play": 5,
	"end": 6, "loss": 7, "pause": 8, "waiting": 9, "continue": 10
};
Object.freeze(levelState);

var playerState = { "init": 1, "ready": 2, "alive": 3, "dead": 4, "won": 5 };
Object.freeze(playerState);

var ducklingState = { "init": 1, "pool": 2, "egg": 3, "duckling": 4, "dead": 5, "despawn": 6 };
Object.freeze(ducklingState);

var hawkState = { "init": 1, "pool": 2, "alive": 3, "stun": 4, "despawn": 5 };
Object.freeze(hawkState);

var croqState = { "init": 1, "pool": 2, "alive": 3, "stun": 4, "despawn": 5 };
Object.freeze(croqState);

var foxState = { "init": 1, "pool": 2, "alive": 3, "stun": 4, "despawn": 5 };
Object.freeze(foxState);

var componentType = {
	"land": 1, "water": 2, "obstacle": 3, "fox": 4, "hawk": 5, "croq": 6,
	"duck": 7, "duckling": 8, "egg": 9, "grass": 10, "stick": 11, "air": 12, "none": 13
};
Object.freeze(componentType);

// CONSTANTS

var motionUnit = 1.0;
var callRadius = 5.0;
var callRadiusOffset = 5.0;
var stunLength = 10;

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max) + 1);
}

var bus = new EventBus();
var clock = new THREE.Clock();
console.log("clock: " + clock);
