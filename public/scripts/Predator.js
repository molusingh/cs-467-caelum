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
    this.getActor = getActor;
    this.move = move;

    // private variables
    var active = false;
    var predatorMover = new ObjectMover(predator);
    var target = null;
    var path = null;
    var currentState = null;
    var randomDirection = null;
    predator.userData.currentDirection = 'down';
    setState(predatorState.pool);

    function spawn()
    {
        grid.placeActor(predator);
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
            predator.position.y = 35;
        }

        target = findTarget(componentType.duck);
        bus.subscribe('movepredator', move);
        if (type != predatorType.hawk)
        {
            setInterval(move, 1000);
        }
        // console.log("INIT UUID: " + predator.uuid);
    }

    // locates the specified target
    function findTarget(targetType)
    {
        return grid.getActorsInRadius(predator.position, 100, targetType)[0];
    }

    // moves the predator
    function move()
    {
        if (!active)
        {
            return;
        }
        target = findTarget(componentType.duck);
        
        if (target) // if predator found target
        {
            path = findPath(predator.position, target.position, isLegalMove);
        }
        else // otherwise no path
        {
            path = null;
        }
        if (path == null) // if no path move randomly
        {
            // console.log("no path found, moving randomly");
            var validRandom = isValid(predator.position, randomDirection);
            var count = 0;
            while (!validRandom) // until direction is valid
            {
                ++count;
                if (count > 10) // if object is stuck
                {
                    return;
                }
                var directions = ['up', 'down', 'left', 'right'];
                randomDirection = directions[getRandomInt(4) - 1];
                validRandom = isValid(predator.position, randomDirection);
            }
            predatorMover[randomDirection]();
            return;
        }
        if (path.move == 'stay')
        {
            return;
        }
        if (path && isLegalMove(path.point))
        {
            predatorMover[path.move]();
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
            validSquares = [componentType.air];
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
