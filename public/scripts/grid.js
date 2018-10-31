
var grid = new board();

function board() {

    /*
    grid knows NOTHING about game rules
    */

    var invisibility = false;
    var superquack = false;
    var envTable;

    //top left corner of board
    var originX = 200;
    var originY = -200;

    initializeEnvTable(40, 40);
    var actorTable = [];

    //sets up empty board, ready to receive info
    //board values default to water;
    function initializeEnvTable(z, x) {
        envTable = new Array(z);

        for (var i = 0; i < z; i++) {
            envTable[i] = new Array(x);
        }

        for (var i = 0; i < z; i++) {
            for (var j = 0; j < x; j++) {
                envTable[i][j] = componentType.water;
            }
        }
    }

    function normalizeX(x) {
        return ((x - originY + 5) / 10);
    }

    function normalizeZ(z) {
        return ((originX - z + 5) / 10);
    }

    function getNormalizedSquareInfo(x, y) {
        //check for invalid requests
        if (x > 40 || y > 40 || x < 1 || y < 1) {
            //TO DO: convert to component.illegal
            return 0;
        }
        return envTable[x - 1][y - 1];
    }

    function getActorSquareInfo(x, y) {
        //check for invalid requests
        if (x > 40 || y > 40 || x < 1 || y < 1) {
            //TO DO: convert to component.illegal
            return null;
        }
        for (var i = 0; i < actorTable.length; i++) {
            var location = actorTable[i].location;

            if (location.x === x && location.y === y) {
                return actorTable[i].actor.userData.componentType;
            }
        }

        return null;
    }

    function getActorInfo(x, y) {
        //check for invalid requests
        if (x > 40 || y > 40 || x < 1 || y < 1) {
            //TO DO: convert to component.illegal
            return null;
        }
        for (var i = 0; i < actorTable.length; i++) {
            var location = actorTable[i].location;

            if (location.x === x && location.y === y) {
                console.log("got here");
                return actorTable[i].actor;
            }
        }

        return null;
    }

    this.reset = function () {
        console.log("NOT implemented")
    }

    this.setInvisibility = function (value) {
        invisibility = value;
    }

    this.setSuperquack = function (value) {
        superquack = value;
    }

    this.getOrigin = function () {
        return new THREE.Vector2(originX, originY);
    }

    //reports what's in the queried location. 
    // ex. pass object's location + offset in z and x, each square is 10 x 10 
    //returns componentType: water, land, duckling, duck, fox, croq, hawk, obstacle, illegal 
    this.getSquareInfo = function (z, x) {

        var normalizedX = ((originX - z + 5) / 10);
        var normalizedY = ((x - originY + 5) / 10);

        //get actor if found in location
        var actorType = getActorSquareInfo(normalizedX, normalizedY);

        if (actorType !== null) {
            //better here than in duck because predators need to query
            if (invisibility === false) {
                return actorType;
            }
            else {
                if (actorType !== componentType.duck && actorType !== componentType.duckling) {
                    return actorType;
                }
            }
        }

        //return env info instead
        return getNormalizedSquareInfo(normalizedX, normalizedY);

    }

    //use as a secondary check when hawk searches for duck or ducklings
    //ex.a square with duckling could also be grass, i.e. no access for hawk
    this.getEnvInfo = function (z, x) {

        var normalizedX = ((originX - z + 5) / 10);
        var normalizedY = ((x - originY + 5) / 10);

        return getNormalizedSquareInfo(normalizedX, normalizedY);

    }

    this.testSquareInfo = function (z, x) {

        console.log("*************************************");
        console.log("above: " + this.getSquareInfo(z, x - 10));
        console.log("below: " + this.getSquareInfo(z, x + 10));
        console.log("right: " + this.getSquareInfo(z - 10, x));
        console.log("left: " + this.getSquareInfo(z + 10, x));
        console.log("duck: " + this.getSquareInfo(z, x));

    }

    //returns array of actors within specific distance away from origin 
    //takes origin point, radius and componentType of target: water, land, duckling, duck, fox, croq, hawk, obstacle, etc
    //returns array of THREE.Object3D objects, check position to locate on grid, calculte distance, etc.
    this.getActorsInRadius = function (origin, radius, searchTarget) {

        var x = normalizeZ(origin.z);
        var y = normalizeX(origin.x);

        var hits = [];

        for (var i = x - radius; i < x + radius + 1; i++) {
            for (var j = y - radius; j < y + radius + 1; j++) {
                var actor = getActorInfo(i, j);
                if (actor !== null) {
                    if (actor.userData.componentType == searchTarget) {
                        hits[hits.length] = actor;
                    }
                }
            }
        }
        return hits;
    }

    //Receives actorObject, updates its location in grid. Submit after move complete or periodically.  
    this.updateActor = function (actor) {

        for (var i = 0; i < actorTable.length; i++) {
            if (actorTable[i].actor === actor) {

                var x = normalizeZ(actor.position.z);
                var y = normalizeX(actor.position.x);

                actorTable[i].location = new THREE.Vector2(x, y);
            }
        }

    }

    this.addActor = function (actor) {
        var x = normalizeZ(actor.position.z);
        var y = normalizeX(actor.position.x);
        var position = new THREE.Vector2(x, y);
        var actorInfo = { actor: actor, location: position }
        //push worked before as well
        actorTable[actorTable.length] = actorInfo;
    }

    this.setEnvSquare = function (x, y, componentType) {
        envTable[x][y] = componentType;
    }

    //testing function
    this.printGrid = function (start_x, end_x, start_y, end_y) {
        for (var j = 0; j < end_y + 1; j++) {
            var line = "";
            for (var i = start_x; i < end_x + 1; i++) {
                line += String(grid[i][j]);
            }
            console.log(line);
        }
    }

    //checks if duckling is within duck's calling radius
    //takes duckling actor, returns bool 
    //reset every cycle by levelAI
    this.updateDucklingsInRadius = function (duck) {
        console.log("updateDucklings");
        superquack ? callRadius + callRadiusOffset : callRadius;
        var ducklingsInRadius = this.getActorsInRadius(duck.position, callRadius, componentType.duckling);
        for (i = 0; i < ducklingsInRadius.length; i++) {
            ducklingsInRadius[i].userData.callable = true;
        }
    }

    //returns boolean reporting if area is a certain component
    //used for placing obstacle blocks on land
    this.blockIsComponent = function (size, location, component) {
        for (var i = location.x; i < location.x + size.x; i++) {
            for (var j = location.y; j < location.y + size.y; j++) {
                var squareComponent = getNormalizedSquareInfo(i, j);
                if (squareComponent !== component) {
                    return false;
                }
            }
        }
        return true;
    }
}