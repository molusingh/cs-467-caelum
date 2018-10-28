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
<<<<<<< HEAD
    duck.userData = { currentDirection: 'down', inAir: false, inWater: false };
=======
>>>>>>> refs/remotes/origin/development
    var maxPos = 185;

    var duckMover = new ObjectMover(duck);

    var playSound = new soundLoader();

    // subscriptions
        // action subscribers
    bus.subscribe("moveLeft", duckMover.left);
    bus.subscribe("moveRight", duckMover.right);
    bus.subscribe("moveDown", duckMover.down);
    bus.subscribe("moveUp", duckMover.up);
<<<<<<< HEAD
    bus.subscribe("flyToggle", duckMover.flyToggle);
    bus.subscribe("jump", jumpSkill);
    bus.subscribe("call", callSkill);
    bus.subscribe("nest", nestSkill);
    
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

    function jumpSkill(object)
    {
        var nextSquare;
        var facing = duck.userData.currentDirection;
        if(duck.userData.inAir === true)
        {
            return;
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
console.log("nextSquare: " + nextSquare);
console.log("inWater: " + duck.userData.inWater);
        if (duck.userData.inWater === false && nextSquare === 2)
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
=======

    bus.subscribe("playerMove", playSound.move);



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
>>>>>>> refs/remotes/origin/development

        if (duck.userData.inWater === true && (nextSquare === 1 || nextSquare === 9 || nextSquare === 10)
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

    this.getState = function () {

        return currentState;
    };

    this.update = function () {

        var elapsedTime = clock.getElapsedTime();

    };

<<<<<<< HEAD
=======
    function onKeyDown(event) {

        switch (event.keyCode) {

            case 38: /*up*/
            case 87: /*W*/
                if (duck.position.x >= -maxPos) {
                    duckMover.up();
                    playSound.move();
                }
                break;

            case 37: /*left*/
            case 65: /*A*/
                if (duck.position.z <= maxPos) {
                    duckMover.left();
                    playSound.move();
                }
                break;

            case 40: /*down*/
            case 83: /*S*/
                if (duck.position.x <= maxPos) {
                    duckMover.down();
                    playSound.move();
                }
                break;

            case 39: /*right*/
            case 68: /*D*/
                if (duck.position.z >= -maxPos) {
                    duckMover.right();
                    playSound.move();
                }
                break;

            case 82: /*R*/ moveUp = true; break;
            case 70: /*F*/ moveDown = true; break;
            case 32: /*SPACEBAR*/ grid.testSquareInfo(duck.position.z, duck.position.x); break;

        }

    }

>>>>>>> refs/remotes/origin/development
}