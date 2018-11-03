function foxAI(scene, fox) {

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

    var currentState = foxState.init;
    var active = false;

    //must report all enum states
    this.getState = function () {
        return currentState;
    }

    this.setActive = function (value) {
        active = value;
    }

    this.update = function () {
        //game paused
        if (!active)
            return;

        var elapsedTime = clock.getElapsedTime();
    }
}