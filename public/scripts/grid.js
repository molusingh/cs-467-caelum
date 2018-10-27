
var grid = new board();

function board() {

    /*
    subscribe: invisibility, superquack
    */

    var invisibility = false;
    var superquack = false;
    var grid;
    var scene;

    //top left corner of board
    var originX = 200;
    var originY = -200;

    var isInitialized = false;

    initializeGrid(40, 40);

    //sets up empty board, ready to receive info
    //board values default to water;
    function initializeGrid(z, x) {
        grid = new Array(z);

        for (var i = 0; i < z; i++) {
            grid[i] = new Array(x);
        }

        for (var i = 0; i < z; i++) {
            for (var j = 0; j < x; j++) {
                grid[i][j] = componentType.water;
                //console.log(grid[i][j]);
            }
        }
    }

    function normalizeX(x) {
        return ((x - originY + 5) / 10);
    }

    function normalizeZ(z) {
        return ((originX - z + 5) / 10);
    }

    //reports what's in the queried location. 
    //returns componentType: water, land, duckling, duck, fox, croq, hawk, obstacle, stick
    getNormalizedSquareInfo = function (x, y) {
        //check for invalid requests
        if (x > 40 || y > 40 || x < 1 || y < 1) {
            //TO DO: convert to component.illegal
            return 0;
        }
        return grid[x - 1][y - 1];
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
        console.log("getActorInRadius: not implemented");
        return 0;
    }

    //receives actor ID and updates the grid info, internally checks position
    this.updateActor = function (actorID, componentType) {

        console.log("updateActorInGrid: not implemented");
        return 0;
    }

    this.setEnvSquare = function (x, y, componentType) {
        grid[x][y] = componentType;
    }

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