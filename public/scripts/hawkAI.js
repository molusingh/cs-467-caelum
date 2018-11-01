function hawkAI(scene, hawk) {

    /*
    -- subscribe
    stun(params: start, stop)

    -- check what's around you
    grid.getSquareInfo(x,z)

    -- find pray
    grid.getActorsInRadius(position(x,z), actorType)

    -- find next location 
    path.getPath(), could return either an array of points or just the next grid location

    -- must update grid after every move
    grid.updateActor(actor

    -- ALL functions MUST be filtered through: if(!active) return;
    */

    var currentState = hawkState.init;
    var active = false;

    hawk.position.y += 35;
    hawk.position.z -= 35;

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