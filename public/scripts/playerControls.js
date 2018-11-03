/* global ObjectMover*/
/* global playerState*/
/* global bus*/
/* global soundLoader*/
function playerControls(scene, clock, duck) {

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
    */

    var currentState = playerState.init;

    duck.userData.currentDirection = 'down';
    console.log(duck.userData.currentDirection);
    duck.userData.inAir = false;
    duck.userData.inWater = false;

    var maxPos = 185;

    var duckMover = new ObjectMover(duck);

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

    function duckUp(object)
    {
        bus.publish("rotateUp");
        var isLegal;
        isLegal = isLegalMove(duck);
        if(isLegal)
        {
            bus.publish("moveUp");
            bus.publish("playerMove");
        }
    }

    function duckDown(object)
    {
        bus.publish("rotateDown");
        var isLegal;
        isLegal = isLegalMove(duck);
        if(isLegal)
        {
            bus.publish("moveDown");
            bus.publish("playerMove");
        }
    }

    function duckLeft(object)
    {
        bus.publish("rotateLeft");
        var isLegal
        isLegal = isLegalMove(duck);
        if(isLegal)
        {
            bus.publish("moveLeft");
            bus.publish("playerMove");
        }
    }

    function duckRight(object)
    {
        bus.publish("rotateRight");
        var isLegal
        isLegal = isLegalMove(duck);
        if(isLegal)
        {
            bus.publish("moveRight");
            bus.publish("playerMove");
        }
    }

    function jumpSkill(object)
    {
        var nextSquare;
        var facing = duck.userData.currentDirection;
        if(duck.userData.inAir === true)
        {
            return;
        }
        
        // get type of square duck is facing
        if (facing === 'up')
        {
            nextSquare = grid.getSquareInfo(duck.position.z, duck.position.x - 10);
        }
        else if (facing === 'left')
        {
            nextSquare = grid.getSquareInfo(duck.position.z + 10, duck.position.x);
        }
        else if (facing === 'down')
        {
            nextSquare = grid.getSquareInfo(duck.position.z, duck.position.x + 10);
        }
        else if (facing === 'right')
        {
            nextSquare = grid.getSquareInfo(duck.position.z - 10, duck.position.x);
        }

        // if duck isn't in water and the square it is facing is water, go ahead
        if (duck.userData.inWater === false && nextSquare == 2)
        {
            bus.publish("jumpSound");
            duck.userData.inWater = true;

            if (facing ==='up')
            {
                bus.publish("moveUp");
            }
            else if (facing === 'left')
            {
                bus.publish("moveLeft");
            }
            else if (facing === 'down')
            {
                bus.publish("moveDown");
            }
            else if (facing === 'right')
            {
                bus.publish("moveRight");
            }
        }

        // if duck is in water and the square it is facing is land, duckling, grass, or stick, go ahead
        if (duck.userData.inWater === true && (nextSquare == 1 || nextSquare == 8 || nextSquare == 9 || nextSquare == 10))
        {
            bus.publish("jumpSound");
            duck.userData.inWater = false;

            if (facing ==='up')
            {
                bus.publish("moveUp");
            }
            else if (facing === 'left')
            {
                bus.publish("moveLeft");
            }
            else if (facing === 'down')
            {
                bus.publish("moveDown");
            }
            else if (facing === 'right')
            {
                bus.publish("moveRight");
            }
        }
    }

    function callSkill(object)
    {
        console.log("callSkill not yet implemented");
    }

    function nestSkill(object)
    {
        console.log("nestSkill not yet implemented");
    }

    //document.addEventListener('keydown', onKeyDown);

    function isLegalMove(object)
    {
        var nextSquare;
        var facing = duck.userData.currentDirection;
        
        // all in-air moves are legal since they are over all tiles
        if (duck.userData.inAir === true)
        {
            return true;
        }
      
        // get type of square duck is facing
        if (facing ==='up')
        {
            nextSquare = grid.getSquareInfo(duck.position.z, duck.position.x - 10);
        }
        else if (facing === 'left')
        {
            nextSquare = grid.getSquareInfo(duck.position.z + 10, duck.position.x);
        }
        else if (facing === 'down')
        {
            nextSquare = grid.getSquareInfo(duck.position.z, duck.position.x + 10);
        }
        else if (facing === 'right')
        {
            nextSquare = grid.getSquareInfo(duck.position.z - 10, duck.position.x);
        }

        // moving from land to land (1), duckling (8), grass (10), or stick (11)
        if (duck.userData.inWater === false && (nextSquare == 1 || nextSquare == 8 || nextSquare == 10 || nextSquare == 11))
        {
            return true;
        }

        // moving from water to water (2), requires jumpSkill to move to land
        if (duck.userData.inWater === true && nextSquare == 2)
        {
            return true;
        }

        // all other moves are illegal
        return false;
    }

    this.getState = function () {

        return currentState;
    };

    this.update = function () {

        var elapsedTime = clock.getElapsedTime();

    };
}