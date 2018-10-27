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
    var maxPos = 185;

    var duckMover = new ObjectMover(duck);

    var playSound = new soundLoader();

    // subscriptions
    bus.subscribe("moveLeft", duckMover.left);
    bus.subscribe("moveRight", duckMover.right);
    bus.subscribe("moveDown", duckMover.down);
    bus.subscribe("moveUp", duckMover.up);

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




    document.addEventListener('keydown', onKeyDown);

    this.getState = function () {

        return currentState;
    };

    this.update = function () {

        var elapsedTime = clock.getElapsedTime();

    };

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

}