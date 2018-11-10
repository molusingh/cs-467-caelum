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

    //when game is paused
    var active = false;
    var currentState = playerState.init;

    duck.userData.currentDirection = 'down';
    // console.log(duck.userData.currentDirection);
    duck.userData.inAir = false;
    duck.userData.inWater = false;

    var maxPos = 185;

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


    // sounds for interface buttons
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
    $("#quackButton").click(playSound.superQuack);

    // action sounds
    $("#flyButton").click(playSound.fly);
    $("#jumpButton").click(playSound.jump);
    $("#callButton").click(playSound.call);
    $("#nestButton").click(playSound.nest);

    function duckUp(object) {
        bus.publish("rotateUp");
        var isLegal;
        isLegal = isLegalMove(duck);
        if (isLegal) {
            bus.publish("moveUp");
            bus.publish("playerMove");
        }
    }

    function duckDown(object) {
        bus.publish("rotateDown");
        var isLegal;
        isLegal = isLegalMove(duck);
        if (isLegal) {
            bus.publish("moveDown");
            bus.publish("playerMove");
        }
    }

    function duckLeft(object) {
        bus.publish("rotateLeft");
        var isLegal
        isLegal = isLegalMove(duck);
        if (isLegal) {
            bus.publish("moveLeft");
            bus.publish("playerMove");
        }
    }

    function duckRight(object) {
        bus.publish("rotateRight");
        var isLegal
        isLegal = isLegalMove(duck);
        if (isLegal) {
            bus.publish("moveRight");
            bus.publish("playerMove");
        }
    }

    function jumpSkill(object) {
        var nextSquare;
        var facing = duck.userData.currentDirection;
        if (duck.userData.inAir === true) {
            return;
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

        // if duck is in water and the square it is facing is land, duckling, grass, or stick, go ahead
        if (duck.userData.inWater === true && (nextSquare == 1 || nextSquare == 8 || nextSquare == 9 || nextSquare == 10)) {
            bus.publish("jumpSound");
            duck.userData.inWater = false;

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

    function callSkill () {
        if (grid.updateDucklingsInRadius === true) {
            console.log("duckling AI follow function here");
        }
    }

    function nestSkill(object) {
        // don't check anything if duck is in water or air
        if (duck.userData.inWater === false && duck.userData.inAir === false) {
            var validArea = grid.getNestArea(duck.position.z, duck.position.x);

            if (validArea != 0 && duck.userData.inWater === false) {
                var stick = new THREE.Object3D();
                stick.name = "stick";
                var manager = new THREE.LoadingManager();
                var shadowMat = new THREE.ShadowMaterial({
                    color: 0xff0000, transparent: true, opacity: 0.5
                });
                    //load nest 
                var stickLoader = new THREE.FBXLoader(manager);
                stickLoader.load('./geo/stick.fbx', function (object) {
                    object.traverse(function (child) {

                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.shadowMaterial = shadowMat;
                        }

                    });
                    object.scale.x = 2;
                    object.scale.y = 2;
                    object.scale.z = 2;

                    stick.add(object);
                    scene.add(stick);

                    // top right
                    if (validArea == 1) {
                        stick.position.z = (duck.position.z - 5);
                        stick.position.x = (duck.position.x - 5);
                    }
                    // bottom right
                    if (validArea == 2) {
                        stick.position.z = (duck.position.z - 5);
                        stick.position.x = (duck.position.x + 5);
                    }
                    // bottom left
                    if (validArea == 3) {
                        stick.position.z = (duck.position.z + 5);
                        stick.position.x = (duck.position.x + 5);
                    }
                    // top left
                    if (validArea == 4) {
                        stick.position.z = (duck.position.z + 5);
                        stick.position.x = (duck.position.x - 5);
                    }

                }, undefined, function (e) {
                    console.error(e);
                });
            }
        }
    }


    function superQuackSkill() {

        foxes = grid.getActorsInRadius(duck.position, callRadius, componentType.fox);
        hawks = grid.getActorsInRadius(duck.position, callRadius, componentType.hawk);
        croqs = grid.getActorsInRadius(duck.position, callRadius, componentType.croq);

        if (foxes.length > 0 || hawks.length > 0 || croqs.length > 0) {
            localStun = true;
            var elapsedTime = clock.getElapsedTime();
            beginStun = elapsedTime;

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

    }

    function speedBoostSkill() {

    }

    function invisibilitySkill() {

    }

    function isLegalMove(object) {

        if (!active)
            return false;

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

        // moving from land to land (1), duckling (8), grass (10), or stick (11)
        if (duck.userData.inWater === false && (nextSquare == 1 || nextSquare == 8 || nextSquare == 10 || nextSquare == 11)) {
            return true;
        }

        // moving from water to water (2), requires jumpSkill to move to land
        if (duck.userData.inWater === true && nextSquare == 2) {
            return true;
        }

        // !!!!!temporary death sim, simulator to acutal!!!!
        if (nextSquare == componentType.fox) {
            currentState = playerState.dead;
            return true;
        }

        // !!!!!temporary win simulation, nothing like actual!!!!!
        if (nextSquare == componentType.croq) {
            currentState = playerState.won;
            return true;
        }

        // all other moves are illegal
        return false;
    }

    this.getState = function () {

        return currentState;
    };

    this.idSelf = function () {

        return "duck";
    };

    this.setActive = function (value) {
        active = value;
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

    };
}