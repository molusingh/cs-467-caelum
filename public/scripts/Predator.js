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
global predatorState 
global predatorType 
global invisActive
global stunLength
*/

/*
 * @param scene passed in scene object
 * @param predator 3d predator object
 * @param type the type of the predator
 */
function Predator(scene, predator, type)
{
    // public functions
    this.toggleActive = toggleActive;
    this.setActive = setActive;
    this.update = update;
    this.init = init;
    this.spawn = spawn;
    this.despawn = despawn;
    this.getActor = getActor;
    this.move = move;

    var id = getRandomInt(10000);
    var predId = getRandomInt(1000);

    // private variables
    var hawkY = 35; // for hawk
    var changeY = false; // for hawk
    var moveIntervalId = null;
    var active = false;
    var predatorMover = new ObjectMover(predator);
    var target = null;
    var path = null;
    var currentState = null;
    var randomDirection = null;
    predator.userData.currentDirection = 'down';
    setState(predatorState.pool);
    var stunTimeoutId = null;
    bus.subscribe("stunned", stun);

    function stun()
    {
        toggleActive();
        stunTimeoutId = setTimeout(function() { toggleActive(); },
            stunLength * 1000);
    }

    function spawn()
    {
        grid.placeActor(predator);
    }

    function despawn()
    {
        //currentState = predatorState.despawn;
        predator.position.y = -100;
        active = false;
        currentState = predatorState.pool;
        clearInterval(moveIntervalId);
    }

    function getActor()
    {
        return predator;
    }

    // initialize the predator
    function init()
    {
        if (type == predatorType.fox)
        {
            predator.position.y = 0.1;
        }
        else if (type == predatorType.croq)
        {
            predator.position.y = 0.1;
        }
        else if (type == predatorType.hawk)
        {
            predator.position.y = hawkY;
            predator.position.x = 5;
            predator.position.z = 5;
        }

        target = findTargets(componentType.duck)[0];
        bus.subscribe('movepredator', move);
        if (type != predatorType.hawk || true)
        {
            moveIntervalId = setInterval(move, 1000);
        }
        // console.log("INIT UUID: " + predator.uuid);
        currentState = predatorState.alive;
    }

    // locates the specified targets
    function findTargets(targetType)
    {
        return grid.getActorsInRadius(predator.position, 100, targetType);
    }

    function getPath(targetType)
    {
        if (invisActive)
        {
            return null;
        }
        var targets = findTargets(targetType);
        var path = null;
        if (targets) // if predator found targets
        {
            for (var i = 0; i < targets.length; ++i)
            {
                target = targets[i];
                path = findPath(predator.position, target.position, isLegalMove);
                if (path)
                {
                    break;
                }
            }
        }
        return path;
    }

    // moves the predator
    function move()
    {
        if (!active)
        {
            return;
        }
        if (type == predatorType.hawk) // for hawks
        {
            if (predator.position.y != hawkY) // if at different Y
            {
                predator.position.y = hawkY; // return to original Y for move
                return;
            }
        }
        path = getPath(componentType.duck); // moved invis to getPath function
        if (path == null) // if no path to duck, go after duckling
        {
            path = getPath(componentType.duckling);
        }
        if (path == null) // if no path move randomly
        {
            var validRandom = isValid(predator.position, randomDirection);
            var count = 0;
            while (!validRandom) // until direction is valid
            {
                ++count;
                if (count > 10) // if object is stuck
                {
                    despawn();
                    console.log('stuck');
                    return;
                }
                var directions = ['up', 'down', 'left', 'right'];
                randomDirection = directions[getRandomInt(4) - 1];
                validRandom = isValid(predator.position, randomDirection);
            }
            predatorMover[randomDirection]();
        }
        else if (path && isLegalMove(path.point)) // follow path
        {
            if (path.move != 'stay')
            {
                predatorMover[path.move]();
            }
        }
        var actor = grid.getActorObject(predator.position, predator);
        if (actor != null) // must be duck or duckling
        {
            if (type == predatorType.hawk && changeY) // for hawk
            {
                predator.position.y = actor.position.y; // move in y to target
            }
            if (predator.position.y == actor.position.y)
            {
                bus.publish("kill", grid.getActorObject(path.point));
            }
            changeY = !changeY;
        }
        else // actor is gone, reset changeY for hawk
        {
            changeY = false;
        }
        grid.updateActor(predator);
    }

    function setActive(value)
    {
        active = value;
    }

    function setState(newState)
    {
        currentState = newState;
    }

    function toggleActive()
    {
        active = !active;
    }

    function update()
    {
        if (currentState === predatorState.init)
        {
            init();
            currentState = predatorState.alive;
        }

        if (currentState === predatorState.despawn)
        {
            predator.position.y = -100;
            active = false;
            currentState = predatorState.pool;
            clearInterval(moveIntervalId);
        }

        var elapsedTime = clock.getElapsedTime();
    }

    // returns true if specified move to target is legal
    function isLegalMove(target)
    {
        if (!active)
        {
            return false;
        }
        var actor = grid.getActor(target); // actor at current target
        if (actor != null && actor != componentType.duck &&
            actor != componentType.duckling)
        {
            return false;
        }
        var squareType = grid.getEnvOnlyInfo(target.z, target.x);
        var validSquares;
        if (type == predatorType.fox)
        {
            validSquares = [componentType.land, componentType.grass];
        }
        else if (type == predatorType.croq)
        {
            validSquares = [componentType.water];
        }
        else if (type == predatorType.hawk)
        {
            validSquares = [
                componentType.air, componentType.land, componentType.water
            ];
        }
        else
        {
            return false;
        }
        return validSquares.find(validate) != undefined;

        function validate(element)
        {
            return element == squareType;
        }
    }

    // returns true if move in specified direction from start poiint is legal
    function isValid(start, direction)
    {
        var target = {};
        switch (direction)
        {
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
