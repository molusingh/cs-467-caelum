function grid(scene) {

    /*
    subscribe: invisibility, superquack
    */

    var invisibility = false;
    var superquack = false;

    //reports what's in the queried location. 
    //returns actorType: water, land, duckling, duck, fox, croq, hawk, obstacle
    this.getSquareInfo = function (x, z) {

        console.log("getSquareInfo: not implemented")
        return 0;
    }

    //reports value of queried square. 
    //takes center pointe coordiantes, actorType: water, land, duckling, duck, fox, croq, hawk, obstacle
    //returns actorType: water, land, duckling, duck, fox, croq, hawk, obstacle
    this.getActorsInRadius = function ({ x, z }, actorType) {

        console.log("getActorInRadius: not implemented")
        return 0;
    }

    //receives actor ID and updates the grid info, internally checks position
    this.updateActorInGrid = function (actorID, actorType) {

        console.log("updateActorInGrid: not implemented")
        return 0;
    }

    //checks if duckling is within duck's calling radius
    this.isInCallRadius = function (actorID) {

        console.log("isInCallRadius: not implemented")
        return 0;
    }

    //reports value of queried square. 
    //returns: water, land, duckling, duck, fox, croq, hawk, obstacle
    this.update = function () {

        var elapsedTime = clock.getElapsedTime();

    }
}