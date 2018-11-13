var playSound = new soundLoader();

// sound subscribers
bus.subscribe("playerMove", playSound.move);
bus.subscribe("clickSound", playSound.click);
bus.subscribe("flySound", playSound.fly);
bus.subscribe("jumpSound", playSound.jump);
bus.subscribe("callSound", playSound.call);
bus.subscribe("nestSound", playSound.nest);
bus.subscribe("invisibilitySound", playSound.invisiblity);
bus.subscribe("speedBoostSound", playSound.speedBoost);
bus.subscribe("superQuackSound", playSound.superQuack);

bus.subscribe("stunSound", playSound.stunned);
bus.subscribe("stopStunSound", playSound.stopStunSound);

bus.subscribe("mainMusic", playSound.mainMusic);

function soundLoader() {

	var sound;
	var stunSound;

	this.click = function () {
		sound = new Audio("./sound/click.mp3");
		sound.play();
	}

	// movement

	this.move = function() {
		sound = new Audio("./sound/duckMove.mp3");
		sound.play();
	}

	this.croqMove = function() {
		sound = new Audio("./sound/croqMove.mp3");
		sound.play();
	}

	this.foxMove = function() {
		sound = new Audio("./sound/foxMove.mp3");
		sound.play();
	}

	this.hawkMove = function() {
		sound = new Audio("./sound/hawkMove.mp3");
		sound.play();
	}

	// skills

	this.fly = function() {
		sound = new Audio ("./sound/fly.mp3");
		sound.play();
	}

	this.jump = function() {
		sound = new Audio("./sound/jump.mp3");
		sound.play();
	}

	this.nest = function() {
		sound = new Audio("./sound/nest.mp3");
		sound.play();
	}

	this.call = function() {
		sound = new Audio("./sound/call.mp3");
		sound.play();
	}

	this.invisiblity = function() {
		sound = new Audio("./sound/invisiblity.mp3");
		sound.play();
	}

	this.speedBoost = function() {
		sound = new Audio("./sound/speedBoost.mp3");
		sound.play();
	}

	this.superQuack = function() {
		sound = new Audio("./sound/superQuack.mp3");
		sound.play();
	}

	// misc

	this.crack = function() {
		sound = new Audio("./sound/crack.mp3");
		sound.play();
	}

	this.death = function() {
		sound = new Audio("./sound/death.mp3");
		sound.play();
	}

	this.duckling = function() {
		sound = new Audio("./sound/duckling.mp3");
		sound.play();
	}

	this.ducklingDeath = function() {
		sound = new Audio("./sound/ducklingDeath.mp3");
		sound.play();
	}

	this.enemyChomp = function() {
		sound = new Audio("./sound/enemyChomp.mp3");
		sound.play();
	}

	this.explode = function() {
		sound = new Audio("./sound/explode.mp3");
		sound.play();
	}
	
	this.notice = function() {
		sound = new Audio("./sound/notice.mp3");
		sound.play();
	}

	this.stunned = function() {
		stunSound = new Audio("./sound/stunned.mp3");
		stunSound.loop = true;
		stunSound.play();
	}

	this.levelEnd = function() {
		sound = new Audio("./sound/levelEnd.mp3");
		sound.play();
	}

	this.stopStunSound = function() {
		stunSound.loop = false;
		stunSound.pause();
	}

	this.mainMusic = function () {
		var mainMusic = new Audio("./sound/mainMusic.mp3");
		mainMusic.loop = true;
		mainMusic.volume = 0.5;
		mainMusic.play();
	}
}