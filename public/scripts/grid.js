
var grid = new board();

function board() {

    /*
    subscribe: invisibility, superquack
    */

    var invisibility = false;
    var superquack = false;
    var envTable, actorTable;
    var scene;

    //top left corner of board
    var originX = 200;
    var originY = -200;

    var isInitialized = false;

    initializeEnvTable(40, 40);
    initializeActorTable(20);

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


    //sets up empty board, ready to receive info
    //board values default to water;
    function initializeActorTable(size) {
        actorTable = new Array(size);
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
            var posX = actorTable[i][position].x;
            if (actorTable[i].position.x === x && actorTable[i].position.y === y) {
                var objectID = actorTable[i].actor.id;
                var object = scene.getObjectByID(objectID);
                return object.userData.componentType;
            }
        }
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

        var actorType = getActorSquareInfo(normalizedX, normalizedY);
        //TO DO: Add invisibility and flying restrictions
        if (actorType !== null) {
            return actorType;
        }

        //return env info instead
        return getNormalizedSquareInfo(normalizedX, normalizedY);

    }

    this.testSquareInfo = function (z, x) {

        console.log("above: " + this.getSquareInfo(z, x - 10));
        console.log("below: " + this.getSquareInfo(z, x + 10));
        console.log("right: " + this.getSquareInfo(z - 10, x));
        console.log("left: " + this.getSquareInfo(z + 10, x));

    }

    //reports location and distance to targets 
    //takes origin point, radius and componentType of target: water, land, duckling, duck, fox, croq, hawk, obstacle
    //returns array of location and distance pairs 
    this.getActorsInRadius = function (location, radius, searchTarget) {

        var x = normalizeZ(location.z);
        var y = normalizeX(location.x);
        var hits = [];

        for (var i = x - radius; i < x + radius + 1; i++) {
            for (var i = y - radius; i < y + radius + 1; i++) {
                var squareValue = getNormalizedSquareInfo(x, y);
                if (squareValue === searchTarget) {
                    //return actual coordinates + actual distance
                    //hits.push(targetLocation, targetDistance);
                }
            }
        }
    }

    //Receives actorObject, updates its location in grid. Submit after move complete or periodically.  
    this.updateActor = function (actor) {

        for (var i = 0; i < actorTable.length; i++) {
            if (actorTable[i].id === actor.id) {

                var x = normalizeZ(actor.position.z);
                var y = normalizeX(actor.position.x);

                actorTable[i].position = new THREE.Vector2(x, y);

            }
        }

    }

    this.addActor = function (actor) {
        var x = normalizeZ(actor.position.z);
        var y = normalizeX(actor.position.x);
        var position = new THREE.Vector2(x, y);
        var actorInfo = { id: actor.id, location: position }
        actorTable.push(actorInfo);
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
    this.isInCallRadius = function (actorID) {

        console.log("isInCallRadius: not implemented");
        return 0;
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