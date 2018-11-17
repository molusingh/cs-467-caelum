
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
        //return ((x - originY) / 10);
        return ((x - originY + 5) / 10);
    }

    function normalizeZ(z) {
        //return ((originX - z) / 10);
        return ((originX - z + 5) / 10);
    }

    function getNormalizedSquareInfo(x, y) {
        //check for invalid requests
        if (x > 40 || y > 40 || x < 1 || y < 1) {
            //TO DO: convert to component.illegal
            return 0;
        }
        var actorInSquare = getActorSquareInfo(x, y);
        if (actorInSquare !== null) {
            //console.log("actor: " + actorInSquare);
            return actorInSquare;
        }
        else {
            return envTable[x - 1][y - 1];
        }
    }

    function getNormalizedEnvSquareInfo(x, y) {
        //check for invalid requests
        if (x > 40 || y > 40 || x < 1 || y < 1) {
            //TO DO: convert to component.illegal
            return componentType.none;
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

    function getActorObjectInSquare(x, y) {
        //check for invalid requests
        if (x > 40 || y > 40 || x < 1 || y < 1) {
            //TO DO: convert to component.illegal
            return null;
        }
        for (var i = 0; i < actorTable.length; i++) {
            var location = actorTable[i].location;

            if (location.x === x && location.y === y) {
                return actorTable[i].actor;
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
                return actorTable[i].actor;
            }
        }

        return null;
    }

    this.reset = function () {
        initializeEnvTable(40, 40);
        for (var i; i < actorTable.length; i++) {
            actorTable[i] = undefined;
        }
        actorTable.length = 0;
        actorTable = [];
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

        //var normalizedX = ((originX - z) / 10);
        //var normalizedY = ((x - originY) / 10);

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

    this.getActor = function (point) {
        var normalizedX = ((originX - point.z + 5) / 10);
        var normalizedY = ((point.x - originY + 5) / 10);

        //get actor if found in location
        return getActorSquareInfo(normalizedX, normalizedY);
    }

    this.getActorObject = function (point) {
        var normalizedX = ((originX - point.z + 5) / 10);
        var normalizedY = ((point.x - originY + 5) / 10);

        //get actor if found in location
        return getActorObjectInSquare(normalizedX, normalizedY);
    }

    //use as a secondary check when hawk searches for duck or ducklings
    //ex.a square with duckling could also be grass, i.e. no access for hawk
    this.getEnvInfo = function (z, x) {

        var normalizedX = ((originX - z + 5) / 10);
        var normalizedY = ((x - originY + 5) / 10);

        return getNormalizedSquareInfo(normalizedX, normalizedY);

    }

    this.getEnvOnlyInfo = function (z, x) {

        var normalizedX = ((originX - z + 5) / 10);
        var normalizedY = ((x - originY + 5) / 10);

        return getNormalizedEnvSquareInfo(normalizedX, normalizedY);

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

    this.removeActor = function (actor) {
        var location = 0;
        var length = actorTable.length;

        for (i = 0; i < length; i++) {
            if (actorTable[i].actor == actor) {
                location = i;
                break;
            }
        }

        for (i = location; i < length - 1; i++) {
            actorTable[i] = actorTable[i + 1];
        }

        actorTable.length = length - 1;
    }

    this.setEnvSquare = function (x, y, componentType) {
        envTable[x][y] = componentType;
    }

    this.setEnvSquareInGameSpace = function (z, x) {
        var x = normalizeZ(z);
        var y = normalizeX(x);
        envTable[x][y] = componentType;
    }

    //testing function
    this.printGrid = function (start_x, end_x, start_y, end_y) {
        for (var j = start_y; j < end_y + 1; j++) {
            var line = "";
            for (var i = start_x; i < end_x + 1; i++) {
                var squareValue = getNormalizedSquareInfo(i, j);
                line += String(squareValue + ",");
                //line += String(envTable[i][j] + ",");
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

    // looks for 2x2 space for nest, returns 0 for no valid area, 1 for top right, 
    // 2 for bottom right, 3 for bottom left, 4 for top left.
    this.getNestArea = function (z, x) {
        var topRight = [];
        var bottomRight = [];
        var bottomLeft = [];
        var topLeft = [];
        var isValidSquare;

        // top right
        topRight[0] = this.getSquareInfo(z, x - 10); // up
        topRight[1] = this.getSquareInfo(z - 10, x - 10); // up + right
        topRight[2] = this.getSquareInfo(z - 10, x); // right

        if (this.validNestArea(topRight) === true) {
            return 1;
        }

        // bottom right
        bottomRight[0] = this.getSquareInfo(z - 10, x); // right
        bottomRight[1] = this.getSquareInfo(z - 10, x + 10); // right + down
        bottomRight[2] = this.getSquareInfo(z, x + 10); // down

        if (this.validNestArea(bottomRight) === true) {
            return 2;
        }

        // bottom left
        bottomLeft[0] = this.getSquareInfo(z, x + 10); // down
        bottomLeft[1] = this.getSquareInfo(z + 10, x + 10); // down + left
        bottomLeft[2] = this.getSquareInfo(z + 10, x); // left

        if (this.validNestArea(bottomLeft) === true) {
            return 3;
        }

        // top left
        topLeft[0] = this.getSquareInfo(z + 10, x); // left
        topLeft[1] = this.getSquareInfo(z + 10, x - 10); // left + up
        topLeft[2] = this.getSquareInfo(z, x - 10); // up

        if (this.validNestArea(topLeft) === true) {
            return 4;
        }
        return 0;

    }

    // returns true if all squares in array are land (1) or grass (10)
    this.validNestArea = function (squareArray) {
        for (i = 0; i < squareArray.length; i++) {
            if (squareArray[i] != 1 && squareArray[i] != 10) {
                return false;
            }
        }
        return true;
    }

    this.placeActor = function (asset) {

        var location = asset.userData.location;
        var locationComponent = asset.userData.locationComponent;

        var testLocation = new THREE.Vector2(1, 1);
        var validLocation = false;
        var assetLocation;

        function findValidSquare() {

            var size = new THREE.Vector2(1, 1);
            validLocation = grid.blockIsComponent(size, location, locationComponent);
            if (validLocation === true) {
                return location;
            }

            var radius = 1;

            while (validLocation === false) {
                for (var i = location.x - radius; i <= location.x + radius; i++) {
                    testLocation.x = i;
                    testLocation.y = location.y + radius;
                    validLocation = grid.blockIsComponent(size, testLocation, locationComponent);
                    if (validLocation === true) {
                        return testLocation;
                    }
                }

                for (var i = location.x - radius; i <= location.x + radius; i++) {
                    testLocation.x = i;
                    testLocation.y = location.y - radius;
                    validLocation = grid.blockIsComponent(size, testLocation, locationComponent);
                    if (validLocation === true) {
                        return testLocation;
                    }
                }
                for (var i = location.y - radius; i <= location.y + radius; i++) {
                    testLocation.x = location.x + radius;
                    testLocation.y = i;
                    validLocation = grid.blockIsComponent(size, testLocation, locationComponent);
                    if (validLocation === true) {
                        return testLocation;
                    }
                }
                for (var i = location.y - radius; i <= location.y + radius; i++) {
                    testLocation.x = location.x - radius;
                    testLocation.y = i;
                    validLocation = grid.blockIsComponent(size, testLocation, locationComponent);
                    if (validLocation === true) {
                        return testLocation;
                    }
                }
                radius++;
                if (radius > 40) {
                    break;
                }
            }

        }

        var assetLocation = findValidSquare();

        if (validLocation === false) {
            console.log("failed: " + asset);
            return;
        }

        var originY = -200;
        var originX = 200;

        var y = originY + (assetLocation.y * 10) - 5;
        var x = originX - (assetLocation.x * 10) + 5;

        asset.position.z = x;
        asset.position.x = y;
        asset.position.y = .1;

        this.addActor(asset);

    }
}