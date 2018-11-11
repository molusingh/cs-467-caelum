/*
-- subscribe
stun
-- check what's around you
grid.getSquareInfo(x,z)
-- find pray
grid.getActorsInRadius(position(x,z), actorType)
-- find next location 
path.getPath(), could return either an array of points or just the next grid location
-- must update grid after every move
grid.updateActor(actorID)
-- ALL functions MUST be filtered through: if(!active) return;
*/

/* global ObjectMover*/
/* global clock*/
/* global grid*/
/* global componentType*/
/* global findPath*/
/* global bus*/
/* global getRandomInt */
/* global foxState */
function foxAI(scene, fox)
{

    // public functions
    this.toggleActive = toggleActive;
    this.setActive = setActive;
    this.update = update;
    this.init = init;
    this.spawn = spawn;
    this.getRandId = getRandId;
    this.getActor = getActor;

    // private variables
    var active = false;
    var foxMover = new ObjectMover(fox);
    var target = null;
    var path = null;
    var currentState = null;
    var randomDirection = null;
    fox.userData.currentDirection = 'down';
    setState(foxState.pool);

    function spawn()
    {

        grid.placeActor(fox);
    }

    function getRandId()
    {
        return randId;
    }

    function getActor()
    {
        return fox;
    }

    function init()
    {
        fox.position.y = .1;
        target = grid.getActorsInRadius(fox.position, 100, componentType.duck)[0];
        bus.subscribe('moveFox', move);
        setInterval(move, 1000);
        console.log("INIT UUID: " + fox.uuid);
    }

    function move()
    {
        if (!active)
        {
            return;
        }
        target = grid.getActorsInRadius(fox.position, 100, componentType.duck)[0];
        if (target) // if fuck found find path
        {
            path = findPath(fox.position, target.position, isLegalMove);
        }
        else
        {
            path = null;
        }
        console.log(path);
        if (path == null) // if no path move randomly
        {
            // console.log("no path found, moving randomly");
            var validRandomDirection = isValid(fox.position, randomDirection);
            var count = 0;
            while (!validRandomDirection) // until direction is valid
            {
                ++count;
                if (count > 5)
                {
                    return;
                }
                var directions = ['up', 'down', 'left', 'right'];
                randomDirection = directions[getRandomInt(4) - 1];
                validRandomDirection = isValid(fox.position, randomDirection);
            }
            foxMover[randomDirection]();
            return;
        }
        if (path.move == 'stay')
        {
            return;
        }
        if (path && isLegalMove(path.point))
        {
            foxMover[path.move]();
        }
        grid.updateActor(fox);
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

        if (currentState === foxState.init)
        {
            init();
            currentState = foxState.alive;
        }

        if (currentState === foxState.despawn)
        {
            fox.position.y = -100;
            active = false;
            currentState = foxState.pool;
        }

        var elapsedTime = clock.getElapsedTime();
    }

    function isLegalMove(target)
    {
        if (!active)
        {
            return false;
        }
        var squareType = grid.getSquareInfo(target.z, target.x);
        switch (squareType)
        {
            case componentType.land:
            case componentType.duck:
            case componentType.duckling:
            case componentType.egg:
            case componentType.grass:
                return true;
        }
        return false;
    }

    function isValid(point, direction)
    {
        var target = {};
        switch (direction)
        {
            case 'up':
                target.z = point.z;
                target.x = point.x - 10;
                break;
            case 'left':
                target.z = point.z + 10;
                target.x = point.x;
                break;
            case 'down':
                target.z = point.z;
                target.x = point.x + 10;
                break;
            case 'right':
                target.z = point.z - 10;
                target.x = point.x;
                break;
            case null:
                return false;
            default:
                console.log('Invalid direction!');
                return false;
        }
        target.y = point.y;
        return isLegalMove(target);
    }
}
