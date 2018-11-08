/* global ObjectMover*/
/* global clock*/
/* global grid*/
/* global componentType*/
/* global findPath*/
/* global bus*/
function foxAI(scene, fox)
{

    // public functions
    foxAI.prototype.toggleActive = toggleActive;
    foxAI.prototype.setActive = setActive;
    foxAI.prototype.update = update;

    // private variables
    var active = false;


    fox.userData.currentDirection = 'down';
    var foxMover = new ObjectMover(fox);
    var duck = grid.getActorsInRadius(fox.position, 100, componentType.duck)[0];


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
        duck = grid.getActorsInRadius(fox.position, 100, componentType.duck)[0];
        var path = findPath(fox.position, duck.position, isLegalMove);
        if (path == null)
        {
            console.log("no path found");
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
}