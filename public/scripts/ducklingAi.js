function ducklingAI(scene, clock, grid, duckling) {

    /*
    -- subscribe
    call (params: start, stop)
     -- then check if 
     grid.isInCallRadius() //returns duck object to follow or null to ignore call 
    -- check what's around you
    grid.getSquareInfo(x,z)
    -- find next location 
    path.getPath(), could return either an array of points or just the next grid location
    -- must update grid after every move
    grid.updateActor(actorID)
    */
    var currentState = ducklingState.init;

    console.log("duckling: " + duckling);
    duckling.position.x += 20;
    duckling.position.z -= 20;

    //must report all enum states
    this.getState = function () {

        return currentState;
    }

    this.update = function () {

        var elapsedTime = clock.getElapsedTime();

    }
}