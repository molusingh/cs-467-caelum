/*
Notes:
subscribe: stun
check what's around you: grid.getSquareInfo(x,z)
find prey: grid.getActorsInRadius(position(x,z), actorType)
must update grid after every move: grid.updateActor(actorID)
ALL functions MUST be filtered through: if(!active) return;
*/

/*
global ObjectMover
global clock
global grid
global componentType
global findPath
global bus
global getRandomInt 
global ducklingState
*/

/*
 * @param scene passed in scene object
 * @param duckling 3d duckling object
 */
function ducklingAI(scene, hatchling, egg) {
    // public functions
    this.toggleActive = toggleActive;
    this.setActive = setActive;
    this.update = update;
    this.init = init;
    this.spawn = spawn;
    this.getActor = getActor;
    this.move = move;

    // private variables
    var duckling = egg;
    var moveIntervalId = null;
    var active = false;
    var ducklingMover;
    //var ducklingMover = new ObjectMover(duckling);
    var target = null;
    var path = null;
    var currentState = null;
    var randomDirection = null;
    setState(ducklingState.pool);

    function spawn() {
        grid.placeActor(duckling);
    }

    function getActor() {
        return duckling;
    }

    function hatch() {

        hatchling.position.x = egg.position.x - 5;
        hatchling.position.y = egg.position.y;
        hatchling.position.z = egg.position.z - 5;
        duckling = hatchling;
        egg.position.y = -100;
        duckling.position.z += 5;
        duckling.position.x += 5;
        duckling.position.y = .1
        ducklingMover = new ObjectMover(duckling);
        duckling.userData.currentDirection = 'down';
        bus.subscribe('moveduckling', move);
        console.log("DUCKLING: " + duckling.position.x, duckling.position.y, duckling.position.z);
        active = true;
        if (true) {
            moveIntervalId = setInterval(move, 1000);
        }
        //TO DO: Update grid with new entity!

    }

    // initialize the duckling
    function init() {
        hatchling.position.y = -100;
        egg.position.y = .1;
        //bus.subscribe('moveduckling', move);
        setTimeout(function () { hatch(); }, egg.userData.hatchTime * 1000);

    }

    // locates the specified target
    function findTarget(targetType) {
        return grid.getActorsInRadius(duckling.position, 100, targetType)[0];
    }

    // moves the duckling
    function move() {
        if (!active) {
            return;
        }
        console.log("got here!!!");
        target = findTarget(componentType.duck);

        if (target) // if duckling found target
        {
            path = findPath(duckling.position, target.position, isLegalMove);
        }
        else // otherwise no path
        {
            path = null;
        }
        if (path == null) // if no path move randomly
        {
            // console.log("no path found, moving randomly");
            var validRandom = isValid(duckling.position, randomDirection);
            var count = 0;
            while (!validRandom) // until direction is valid
            {
                ++count;
                if (count > 10) // if object is stuck
                {
                    console.log('stuck');
                    return;
                }
                var directions = ['up', 'down', 'left', 'right'];
                randomDirection = directions[getRandomInt(4) - 1];
                validRandom = isValid(duckling.position, randomDirection);
            }
            ducklingMover[randomDirection]();
            return;
        }
        if (path.move == 'stay') {
            return;
        }
        if (path && isLegalMove(path.point)) {
            var rotateMove = 'rotate' + path.move[0].toUpperCase()
                + path.move.substring(1);
            ducklingMover[rotateMove](); // always rotate to face
            if (grid.getActor(path.point) == null) {
                console.log("should MOVE");
                ducklingMover[path.move]();
            }
        }
        grid.updateActor(duckling);
    }

    function setActive(value) {
        active = value;
    }

    function setState(newState) {
        currentState = newState;
    }

    function toggleActive() {
        active = !active;
    }

    function update() {
        if (currentState === ducklingState.init) {
            init();
            currentState = ducklingState.alive;
        }

        if (currentState === ducklingState.despawn) {
            duckling.position.y = -100;
            active = false;
            currentState = ducklingState.pool;
            clearInterval(moveIntervalId);
        }

        var elapsedTime = clock.getElapsedTime();
    }

    // returns true if specified move to target is legal
    function isLegalMove(target) {
        if (!active) {
            return false;
        }
        var squareType = grid.getEnvOnlyInfo(target.z, target.x);
        var validSquares = [
            componentType.land,
            componentType.grass,
            componentType.water
        ];
        return validSquares.find(validate) != undefined;

        function validate(element) {
            return element == squareType;
        }
    }

    // returns true if move in specified direction from start poiint is legal
    function isValid(start, direction) {
        var target = {};
        switch (direction) {
            case 'up':
                target.z = start.z;
                target.x = start.x - 10;
                break;
            case 'left':
                target.z = start.z + 10;
                target.x = start.x;
                break;
            case 'down':
                target.z = start.z;
                target.x = start.x + 10;
                break;
            case 'right':
                target.z = start.z - 10;
                target.x = start.x;
                break;
            case null:
                return false;
            default:
                console.log('Invalid direction!');
                return false;
        }
        target.y = start.y;
        return isLegalMove(target);
    }
}
