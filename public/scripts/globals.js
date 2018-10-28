/* global EventBus*/
// ENUMS

//Note: these are 'external states', internal representations can have more

var gameState = { "start": 1, "level": 2, "boosts": 3, "win": 4, "lose": 5 };
Object.freeze(gameState);

var levelState = { "init": 1, "ready": 2, "play": 3, "end": 4 };
Object.freeze(levelState);

var playerState = { "init": 1, "ready": 2, "alive": 3, "dead": 4 };
Object.freeze(playerState);

var ducklingState = { "init": 1, "ready": 2, "egg": 3, "duckling": 4, "dead": 5 };
Object.freeze(ducklingState);

var hawkState = { "init": 1, "ready": 2, "alive": 3, "stun": 4 };
Object.freeze(hawkState);

var croqState = { "init": 1, "ready": 2, "alive": 3, "stun": 4 };
Object.freeze(croqState);

var foxState = { "init": 1, "ready": 2, "alive": 3, "stun": 4 };
Object.freeze(foxState);

var componentType = {
    "land": 1, "water": 2, "obstacle": 3, "fox": 4, "hawk": 5, "croq": 6,
    "duck": 7, "duckling": 7, "egg": 8, "grass": 9, "stick": 10, "illegal": 11
};
Object.freeze(componentType);

// CONSTANTS

var motionUnit = 1.0;

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max) + 1);
}

var bus = new EventBus();

function soundLoader() {

	var sound;

	soundLoader.prototype.click = click;
	soundLoader.prototype.move = move;
	soundLoader.prototype.croqMove = croqMove;
	soundLoader.prototype.hawkMove = hawkMove;
	soundLoader.prototype.foxMove = foxMove;
	soundLoader.prototype.fly = fly;	
	soundLoader.prototype.jump = jump;
	soundLoader.prototype.nest = nest;
	soundLoader.prototype.call = call;
	soundLoader.prototype.invisiblity = invisiblity;
	soundLoader.prototype.speedBoost = speedBoost;
	soundLoader.prototype.superQuack = superQuack;
	soundLoader.prototype.crack = crack;
	soundLoader.prototype.death = death;
	soundLoader.prototype.duckling = duckling;
	soundLoader.prototype.ducklingDeath = ducklingDeath;
	soundLoader.prototype.enemyChomp = enemyChomp;
	soundLoader.prototype.explode = explode;
	soundLoader.prototype.notice = notice;
	soundLoader.prototype.stunned = stunned;
	soundLoader.prototype.levelEnd = levelEnd;

	function click() {
		sound = new Audio("./sound/click.mp3");
		sound.play();
	}

	// movement

	function move() {
		sound = new Audio("./sound/duckMove.mp3");
		sound.play();
	}

	function croqMove() {
		sound = new Audio("./sound/croqMove.mp3");
		sound.play();
	}

	function foxMove() {
		sound = new Audio("./sound/foxMove.mp3");
		sound.play();
	}

	function hawkMove() {
		sound = new Audio("./sound/hawkMove.mp3");
		sound.play();
	}

	// skills

	function fly() {
		sound = new Audio ("./sound/fly.mp3");
		sound.play();
	}

	function jump() {
		sound = new Audio("./sound/jump.mp3");
		sound.play();
	}

	function nest() {
		sound = new Audio("./sound/nest.mp3");
		sound.play();
	}

	function call() {
		sound = new Audio("./sound/call.mp3");
		sound.play();
	}

	function invisiblity() {
		sound = new Audio("./sound/invisiblity.mp3");
		sound.play();
	}

	function speedBoost() {
		sound = new Audio("./sound/speedBoost.mp3");
		sound.play();
	}

	function superQuack() {
		sound = new Audio("./sound/superQuack.mp3");
		sound.play();
	}

	// misc

	function crack() {
		sound = new Audio("./sound/crack.mp3");
		sound.play();
	}

	function death() {
		sound = new Audio("./sound/death.mp3");
		sound.play();
	}

	function duckling() {
		sound = new Audio("./sound/duckling.mp3");
		sound.play();
	}

	function ducklingDeath() {
		sound = new Audio("./sound/ducklingDeath.mp3");
		sound.play();
	}

	function enemyChomp() {
		sound = new Audio("./sound/enemyChomp.mp3");
		sound.play();
	}

	function explode() {
		sound = new Audio("./sound/explode.mp3");
		sound.play();
	}
	
	function notice() {
		sound = new Audio("./sound/notice.mp3");
		sound.play();
	}

	function stunned() {
		sound = new Audio("./sound/stunned.mp3");
		sound.play();
	}

	function levelEnd() {
		sound = new Audio("./sound/levelEnd.mp3");
		sound.play();
	}

}
