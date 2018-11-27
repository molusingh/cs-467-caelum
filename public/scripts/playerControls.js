/* global ObjectMover*/
/* global playerState*/
/* global bus*/
/* global soundLoader*/
function playerControls(scene, duck, flyingDuck) {

    /*
    -- subscribe
    speedboost (params: start, stop)
    jump
    arrow keys
    fly
    

     -- then check if 
     grid.isInCallRadius() //returns duck object to follow or null to ignore call 

    -- check what's around you
    grid.getSquareInfo(x,z)

    -- find next location 
    path.getPath(), could return either an array of points or just the next grid location

    -- must update grid after every move
    grid.updateActor(actorID)

    -- ALL functions MUST be filtered through: if(!active) return;
    */

    var nestBuilder = new assetGen(scene);

    //when game is paused
    var active = false;
    var currentState = playerState.init;

    duck.userData.currentDirection = 'down';
    // console.log(duck.userData.currentDirection);
    duck.userData.inAir = false;
    duck.userData.inWater = false;
    duck.position.y = .1;
    flyingDuck.visible = false;

    var maxPos = 185;

    var nextPoint = {};

    var duckMover = new ObjectMover(duck, true);
    setTimeout(function () { duckMover.updateCam(); 500 });

    // superquack variables
    //    var localStun = false;
    //    var beginStun;
    var stunTimeoutId = null;
    var foxes = [];
    var hawks = [];
    var croqs = [];

    // invis variables
    var invisTimeoutId = null;

    var skillLockTimeoutId = null;
    var skillLockoutLength = 30;
    var stunLock = false;
    var speedLock = false;
    var invisLock = false;

    //!!! Add if(active) to all core functions
    //in Mover, 

    // subscriptions
    bus.subscribe("moveLeft", duckMover.left);
    bus.subscribe("rotateLeft", duckMover.rotateLeft);
    bus.subscribe("duckLeft", duckLeft);
    bus.subscribe("moveRight", duckMover.right);
    bus.subscribe("rotateRight", duckMover.rotateRight);
    bus.subscribe("duckRight", duckRight);
    bus.subscribe("moveDown", duckMover.down);
    bus.subscribe("rotateDown", duckMover.rotateDown);
    bus.subscribe("duckDown", duckDown);
    bus.subscribe("moveUp", duckMover.up);
    bus.subscribe("rotateUp", duckMover.rotateUp);
    bus.subscribe("duckUp", duckUp);
    bus.subscribe("flyToggle", fly);
    bus.subscribe("jump", jumpSkill);
    bus.subscribe("call", callSkill);
    bus.subscribe("nest", nestSkill);
    bus.subscribe("quackSkillRequested", superQuackSkill);
    bus.subscribe("speedSkillRequested", speedBoostSkill);
    bus.subscribe("invisibilitySkillRequested", invisibilitySkill);
    bus.subscribe("kill", kill);
    bus.subscribe("foundStick", stickCounter);


    bus.subscribe("gridTest", gridTest);

    function gridTest() {
        grid.testSquareInfo(duck.position.z, duck.position.x);
    }

    function fly() {
        duckMover.flyToggle();
        if (duck.userData.inAir) {
            duck.visible = false;
            flyingDuck.visible = true;
        }
        else {
            flyingDuck.visible = false;
            duck.visible = true;
        }
    }


    /* sounds for interface buttons
    $("#movementControls").click(playSound.click);
    $("#movementControls").click(playSound.move);
    $("#skillButtons").click(playSound.click);
    $("#actionButtons").click(playSound.click);
    $("#startButton").click(playSound.click);
    $("#howToPlayButton").click(playSound.click);
    $("#menu").click(playSound.click);
    $("#menuButton").click(playSound.click);

    // skill sounds
    $("#invisibilityButton").click(playSound.invisiblity);
    $("#speedButton").click(playSound.speedBoost);


    // action sounds
    $("#flyButton").click(playSound.fly);
    $("#jumpButton").click(playSound.jump);
    $("#callButton").click(playSound.call);
*/
    function duckUp(object) {
        if (!active) {
            return;
        }

        bus.publish("rotateUp");
        var isLegal;
        isLegal = isLegalMove(duck);
        if (isLegal) {
            nextPoint.z = duck.position.z;
            nextPoint.x = duck.position.x - 10;
            stickCheck(nextPoint);
            bus.publish("moveUp");
            bus.publish("cameraKeyUp");
            bus.publish("playerMove");

        }
    }

    function duckDown(object) {
        if (!active) {
            return;
        }

        bus.publish("rotateDown");
        var isLegal;
        isLegal = isLegalMove(duck);
        if (isLegal) {
            nextPoint.z = duck.position.z;
            nextPoint.x = duck.position.x + 10
            stickCheck(nextPoint);
            bus.publish("moveDown");
            bus.publish("cameraKeyDown");
            bus.publish("playerMove");
        }
    }

    function duckLeft(object) {
        if (!active) {
            return;
        }

        bus.publish("rotateLeft");
        var isLegal
        isLegal = isLegalMove(duck);
        if (isLegal) {
            nextPoint.z = duck.position.z + 10;
            nextPoint.x = duck.position.x;
            stickCheck(nextPoint);
            bus.publish("moveLeft");
            bus.publish("cameraKeyLeft");
            bus.publish("playerMove");
        }
    }

    function duckRight(object) {
        if (!active) {
            return;
        }

        bus.publish("rotateRight");
        var isLegal
        isLegal = isLegalMove(duck);
        if (isLegal) {
            nextPoint.z = duck.position.z - 10;
            nextPoint.x = duck.position.x;
            stickCheck(nextPoint);
            bus.publish("moveRight");
            bus.publish("cameraKeyRight");
            bus.publish("playerMove");
        }
    }

    function stickCheck(point) {
        if (duck.userData.inAir === true) {
            return;
        }

        var stickObject;

        if (grid.getSquareInfo(point.z, point.x) == componentType.stick) {
            stickObject = grid.getActorObject(point);
            bus.publish("foundStick", stickObject);
        }
    }

    function stickCounter() {
        var currentSticks = document.getElementById('sticksOutput');
        var numSticks = currentSticks.innerHTML;
        numSticks++;
        currentSticks.innerHTML = numSticks;
    }

    function jumpSkill(object) {
        if (!active) {
            return;
        }

        var nextSquare;

        var facing = duck.userData.currentDirection;
        if (duck.userData.inAir === true) {
            return;
        }

        // get type of square duck is facing
        if (facing === 'up') {
            nextSquare = grid.getSquareInfo(duck.position.z, duck.position.x - 10);
            nextPoint.z = duck.position.z;
            nextPoint.x = duck.position.x - 10;
        }
        else if (facing === 'left') {
            nextSquare = grid.getSquareInfo(duck.position.z + 10, duck.position.x);
            nextPoint.z = duck.position.z + 10;
            nextPoint.x = duck.position.x;
        }
        else if (facing === 'down') {
            nextSquare = grid.getSquareInfo(duck.position.z, duck.position.x + 10);
            nextPoint.z = duck.position.z;
            nextPoint.x = duck.position.x + 10
        }
        else if (facing === 'right') {
            nextSquare = grid.getSquareInfo(duck.position.z - 10, duck.position.x);
            nextPoint.z = duck.position.z - 10;
            nextPoint.x = duck.position.x;
        }

        // if duck isn't in water and the square it is facing is water, go ahead
        if (duck.userData.inWater === false && nextSquare == componentType.water) {
            bus.publish("jumpSound");
            duck.userData.inWater = true;

            if (facing === 'up') {
                bus.publish("moveUp");
                bus.publish("cameraKeyUp");
            }
            else if (facing === 'left') {
                bus.publish("moveLeft");
                bus.publish("cameraKeyLeft");
            }
            else if (facing === 'down') {
                bus.publish("moveDown");
                bus.publish("cameraKeyDown");
            }
            else if (facing === 'right') {
                bus.publish("moveRight");
                bus.publish("cameraKeyRight");
            }
        }

        // if duck is in water and the square it is facing is land, duckling, grass, egg, stick, or nest go ahead
        if (duck.userData.inWater === true && (nextSquare == componentType.land || nextSquare == componentType.duckling || nextSquare == componentType.grass || nextSquare == componentType.egg || nextSquare == componentType.stick || nextSquare == componentType.nest)) {

            bus.publish("jumpSound");
            duck.userData.inWater = false;

            if (nextSquare == 11) {
                stickCheck(nextPoint);
            }

            if (facing === 'up') {
                bus.publish("moveUp");
                bus.publish("cameraKeyUp");
            }
            else if (facing === 'left') {
                bus.publish("moveLeft");
                bus.publish("cameraKeyLeft");
            }
            else if (facing === 'down') {
                bus.publish("moveDown");
                bus.publish("cameraKeyDown");
            }
            else if (facing === 'right') {
                bus.publish("moveRight");
                bus.publish("cameraKeyRight");
            }
        }


    }

    function callSkill() {
        if (!active) {
            return;
        }

        // don't check anything if duck is in water or air
        if (duck.userData.inWater === false && duck.userData.inAir === false) {
            // console.log("duckling AI follow function here");
            bus.publish("callSound");
        }
    }

    function nestSkill(scene) {
        if (!active) {
            return;
        }

        var currentSticks = document.getElementById('sticksOutput');
        var numSticks = currentSticks.innerHTML;

        if (numSticks < 4) {
            return;
        }

        var duckZ = duck.position.z;
        var duckX = duck.position.x;

        // don't check anything if duck is in water or air
        if (duck.userData.inWater === false && duck.userData.inAir === false) {

            var validArea = grid.getNestArea(duck.position.z, duck.position.x);

            if (validArea != 0 && duck.userData.inWater === false) {

                // top right
                if (validArea == 1) {
                    nestBuilder.generateNest(duckZ - 5, duckX - 5);

                }
                // bottom right
                if (validArea == 2) {
                    nestBuilder.generateNest(duckZ - 5, duckX + 5);

                }
                // bottom left
                if (validArea == 3) {
                    nestBuilder.generateNest(duckZ + 5, duckX + 5);

                }
                // top left
                if (validArea == 4) {
                    nestBuilder.generateNest(duckZ + 5, duckX - 5);
                }

                bus.publish("nestSound");
                numSticks -= 4;
                currentSticks.innerHTML = numSticks;
            }
        }
    }


    function superQuackSkill() {
        if (!active) {
            return;
        }

        if (stunLock === true) {
            return;
        }
        else {
            foxes = grid.getActorsInRadius(duck.position, callRadius, componentType.fox);
            hawks = grid.getActorsInRadius(duck.position, callRadius, componentType.hawk);
            croqs = grid.getActorsInRadius(duck.position, callRadius, componentType.croq);


            if (foxes.length > 0 || hawks.length > 0 || croqs.length > 0) {
                bus.publish("superQuackSound");
                bus.publish("stunSound");

                for (i = 0; i < foxes.length; i++) {
                    bus.publish("stunned", foxes[i]);
                }

                for (i = 0; i < hawks.length; i++) {
                    bus.publish("stunned", hawks[i]);
                }

                for (i = 0; i < croqs.length; i++) {
                    bus.publish("stunned", croqs[i]);
                }

                stunTimeoutId = setTimeout(function () { resetStunStatus(); }, stunLength * 1000);
            }
            skillLockout("stun");
        }
    }

    // called by update function after (stunLength) seconds has elapsed
    function resetStunStatus() {
        while (foxes.length > 0) {
            foxes.shift();
        }
        while (hawks.length > 0) {
            hawks.shift();
        }
        while (croqs.length > 0) {
            croqs.shift();
        }

        bus.publish("stopStunSound");

    }

    function speedBoostSkill() {
        if (!active) {
            return;
        }

        if (speedLock === true) {
            return;
        }
        else {
            bus.publish("speedBoostSound");
            bus.publish("toggleSpeedBoost");
            speedTimeoutId = setTimeout(function () { bus.publish("toggleSpeedBoost"); }, speedLength * 1000);
            skillLockout("speed");
        }

    }

    function invisibilitySkill() {
        if (!active) {
            return;
        }

        if (invisLock === true) {
            return;
        }
        else {
            bus.publish("invisibilitySound");
            invisActive = true;
            invisTimeoutId = setTimeout(function () { invisActive = false; }, invisLength * 1000);
            skillLockout("invis");
        }
    }

    function skillLockout(skill) {

        if (skill == "stun") {
            if (stunLock === false) {
                stunLock = true;
                skillLockTimeoutId = setTimeout(function () { skillLockout("stun"); }, skillLockoutLength * 1000);
            }
            else {
                stunLock = false;
            }
        }

        else if (skill == "speed") {
            if (speedLock === false) {
                speedLock = true;
                skillLockTimeoutId = setTimeout(function () { skillLockout("speed"); }, skillLockoutLength * 1000);
            }
            else {
                speedLock = false;
            }
        }

        else if (skill == "invis") {
            if (invisLock === false) {
                invisLock = true;
                skillLockTimeoutId = setTimeout(function () { skillLockout("invis"); }, skillLockoutLength * 1000);
            }
            else {
                invisLock = false;
            }
        }

    }

    function kill(victim) {
        if (victim != duck) {
            return;
        }
        var location = new THREE.Vector3(duck.position.x, duck.position.y, duck.position.z);
        anim = new animation(scene);
        anim.placeBlood(location);
        victim.position.y = -100;

        setTimeout(callback, 1000);
        active = false;
        nestBuilder.cleanup();
        function callback() {
            currentState = playerState.dead;
        }

    }

    function isLegalMove(object) {

        if (!active) {
            return false;
        }

        var nextSquare;
        var facing = duck.userData.currentDirection;

        // all in-air moves are legal since they are over all tiles
        if (duck.userData.inAir === true) {
            return true;

        }

        // get type of square duck is facing
        if (facing === 'up') {
            nextSquare = grid.getSquareInfo(duck.position.z, duck.position.x - 10);
        }
        else if (facing === 'left') {
            nextSquare = grid.getSquareInfo(duck.position.z + 10, duck.position.x);
        }
        else if (facing === 'down') {
            nextSquare = grid.getSquareInfo(duck.position.z, duck.position.x + 10);
        }
        else if (facing === 'right') {
            nextSquare = grid.getSquareInfo(duck.position.z - 10, duck.position.x);
        }

        // console.log("NEXT: " + nextSquare);

        // moving from land to land, duckling, grass, egg, stick, or nest
        if (duck.userData.inWater === false && (nextSquare == componentType.land || nextSquare == componentType.grass || nextSquare == componentType.stick || nextSquare == componentType.nest)) {
            return true;
        }

        // moving from water to water, requires jumpSkill to move to land
        if (duck.userData.inWater === true && nextSquare == componentType.water) {
            return true;
        }

        // we run into ground predator and die 
        if (nextSquare === componentType.fox || ((nextSquare === componentType.croq || nextSquare === componentType.hawk) && duck.userData.inWater === true)) {
            currentState = playerState.dead;
            return true;
        }

        // all other moves are illegal
        return false;
    }

    this.getState = function () {

        return currentState;
    };

    this.setState = function (newState) {

        currentState = newState;
    };

    this.reset = function () {
        duck.userData.inWater = false;
        duck.userData.inAir = false;
    }

    this.idSelf = function () {

        return "duck";
    };

    this.setActive = function (value) {
        active = value;
    }

    this.spawn = function () {
        grid.placeActor(duck);
    }

    this.getActor = function () {
        return duck;
    }

    this.cleanup = function () {
        nestBuilder.cleanup();
    }


    this.update = function () {

        if (!active)
            return;

        var elapsedTime = clock.getElapsedTime();

        if (duck.userData.inAir) {
            flyingDuck.position.x = duck.position.x;
            flyingDuck.position.y = duck.position.y;
            flyingDuck.position.z = duck.position.z;
            flyingDuck.rotation.x = duck.rotation.x;
            flyingDuck.rotation.y = duck.rotation.y;
            flyingDuck.rotation.z = duck.rotation.z;

        }

/*        if (localStun === true) {
            // stunLength is global, modified by superquack level
            if (elapsedTime - beginStun > stunLength) {
                resetStunStatus();
            }
        }
*/    }

}