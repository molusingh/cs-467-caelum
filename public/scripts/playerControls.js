/* global ObjectMover*/
/* global playerState*/
/* global bus*/
/* global soundLoader*/
function playerControls(scene, duck) {

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

    var maxPos = 185;

    var nextPoint = {};

    var duckMover = new ObjectMover(duck);

    // superquack variables
    var localStun = false;
    var beginStun;
    var foxes;
    var hawks;
    var croqs;

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
    bus.subscribe("flyToggle", duckMover.flyToggle);
    bus.subscribe("jump", jumpSkill);
    bus.subscribe("call", callSkill);
    bus.subscribe("nest", nestSkill);
    bus.subscribe("quackSkillRequested", superQuackSkill);
    bus.subscribe("speedSkillRequested", speedBoostSkill);
    bus.subscribe("invisibilitySkillRequested", invisibilitySkill);
    bus.subscribe("kill", kill);

    bus.subscribe("gridTest", gridTest);

    function gridTest() {
        grid.testSquareInfo(duck.position.z, duck.position.x);
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
            bus.publish("playerMove");
        }
    }

    function stickCheck(point) {
        if (duck.userData.inAir === true) {
            return;
        }

        var stickObject;

        if (grid.getSquareInfo(point.z, point.x) == 11) {
            stickObject = grid.getActorObject(point);
            bus.publish("foundStick", stickObject);
        }
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
        if (duck.userData.inWater === false && nextSquare == 2) {
            bus.publish("jumpSound");
            duck.userData.inWater = true;

            if (facing === 'up') {
                bus.publish("moveUp");
            }
            else if (facing === 'left') {
                bus.publish("moveLeft");
            }
            else if (facing === 'down') {
                bus.publish("moveDown");
            }
            else if (facing === 'right') {
                bus.publish("moveRight");
            }
        }

        // if duck is in water and the square it is facing is land, duckling, grass, stick, or nest go ahead
        if (duck.userData.inWater === true && (nextSquare == 1 || nextSquare == 8 || nextSquare == 9 || nextSquare == 10 || nextSquare == 11 || nextSquare == 14)) {

            bus.publish("jumpSound");
            duck.userData.inWater = false;

            if (nextSquare == 11) {
                stickCheck(nextPoint);
            }

            if (facing === 'up') {
                bus.publish("moveUp");
            }
            else if (facing === 'left') {
                bus.publish("moveLeft");
            }
            else if (facing === 'down') {
                bus.publish("moveDown");
            }
            else if (facing === 'right') {
                bus.publish("moveRight");
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
            }
        }
    }


    function superQuackSkill() {
        if (!active) {
            return;
        }

        foxes = grid.getActorsInRadius(duck.position, callRadius, componentType.fox);
        hawks = grid.getActorsInRadius(duck.position, callRadius, componentType.hawk);
        croqs = grid.getActorsInRadius(duck.position, callRadius, componentType.croq);

        if (foxes.length > 0 || hawks.length > 0 || croqs.length > 0) {
            localStun = true;
            beginStun = clock.getElapsedTime();

            bus.publish("stunSound");

            for (i = 0; i < foxes.length; i++) {
                foxes[i].userData.stunStatus = true;
            }

            for (i = 0; i < hawks.length; i++) {
                hawks[i].userData.stunStatus = true;
            }

            for (i = 0; i < croqs.length; i++) {
                croqs[i].userData.stunStatus = true;
            }
        }
    }

    // called by update function after (stunLength) seconds has elapsed
    function resetStunStatus() {
        localStun = false;

        while (foxes.length > 0) {
            foxes[0].userData.stunStatus = false;
            foxes.pop();
        }
        while (hawks.length > 0) {
            hawks[0].userData.stunStatus = false;
            hawks.pop();
        }
        while (croqs.length > 0) {
            croqs[0].userData.stunStatus = false;
            croqs.pop();
        }

        bus.publish("stopStunSound");

    }

    function speedBoostSkill() {
        if (!active) {
            return;
        }
    }

    function invisibilitySkill() {
        if (!active) {
            return;
        }
    }
    
    function kill(ducklingKilled)
    {
        if (ducklingKilled != duck)
        {
            return;
        }
        active = false;
        currentState = playerState.dead;
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

        // moving from land to land (1), duckling (8), grass (10), stick (11), or nest (14)
        if (duck.userData.inWater === false && (nextSquare == 1 || nextSquare == 8 || nextSquare == 10 || nextSquare == 11 || nextSquare == 14)) {
            return true;
        }

        // moving from water to water (2), requires jumpSkill to move to land
        if (duck.userData.inWater === true && nextSquare == 2) {
            return true;
        }

        // !!!!!temporary death sim, simulator to acutal!!!!
        if (nextSquare === componentType.fox || nextSquare === componentType.croq) {
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


    this.update = function () {

        if (!active)
            return;

        var elapsedTime = clock.getElapsedTime();

        if (localStun === true) {
            // stunLength is global, modified by superquack level
            if (elapsedTime - beginStun > stunLength) {
                resetStunStatus();
            }
        }
    }

}