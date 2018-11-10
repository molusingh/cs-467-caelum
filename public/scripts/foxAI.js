/* global ObjectMover*/
/* global clock*/
/* global grid*/
/* global componentType*/
/* global findPath*/
/* global bus*/
/* global getRandomInt */
function foxAI(scene, fox)
{

    // public functions
    foxAI.prototype.toggleActive = toggleActive;
    foxAI.prototype.setActive = setActive;
    foxAI.prototype.update = update;

    // private variables
    var active = false;
    var foxMover = new ObjectMover(fox);
    var duck = grid.getActorsInRadius(fox.position, 100, componentType.duck)[0];
    var randomDirection = null;
    fox.userData.currentDirection = 'down';


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

    // setInterval(move, 1000);

    bus.subscribe('moveFox', move);

    setInterval(move, 1000);

    function move()
    {
        if (!active)
        {
            return;
        }
        duck = grid.getActorsInRadius(fox.position, 100, componentType.duck)[0];
        var path = null;
        if (duck)
        {
            path = findPath(fox.position, duck.position, isLegalMove);
        }
        if (path == null) // if no path move randomly
        {
            // console.log("no path found, moving randomly");
            var validRandomDirection = isValid(fox.position, randomDirection);
            while (!validRandomDirection) // until direction is valid
            {
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

    function toggleActive()
    {
        active = !active;
    }

    function update()
    {
        if (!active)
        {
            return;
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
