function croqAI(scene, clock, croq) {

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
    */

    var currentState = croqState.init;

    //must report all enum states
    this.getState = function () {

        return currentState;
    }

    this.update = function () {

        var elapsedTime = clock.getElapsedTime();

    }
}