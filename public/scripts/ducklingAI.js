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

    //must report all enum states
    this.getState = function () {

        return currentState;
    }

    this.update = function () {

        var elapsedTime = clock.getElapsedTime();

    }

    /***********TESTING ONLY ********/
    document.addEventListener('keydown', onKeyDown);

    function onKeyDown(event) {

        switch (event.keyCode) {
            case 32:
            /*SPACEBAR*/ console.log("duckling is callable: " + duckling.userData.callable);
        }

    }
}