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
    duck.userData = { currentDirection: 'down', inAir: false, inWater: false };
    var maxPos = 185;

    var duckMover = new ObjectMover(duck);

    var playSound = new soundLoader();
    
    // subscriptions
        // action subscribers
    bus.subscribe("moveLeft", duckMover.left);
    bus.subscribe("moveRight", duckMover.right);
    bus.subscribe("moveDown", duckMover.down);
    bus.subscribe("moveUp", duckMover.up);
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

    // document.addEventListener('keydown', onKeyDown);

    this.getState = function () {

        return currentState;
    };

    this.update = function () {

        var elapsedTime = clock.getElapsedTime();

    };

}