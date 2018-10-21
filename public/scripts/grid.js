
var grid = new board();

function board() {

    /*
    subscribe: invisibility, superquack
    */

    var invisibility = false;
    var superquack = false;
    var grid;
    var scene;

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
                console.log(grid[i][j]);
            }
        }
    }

    //this sets the scene
    function setScene(currentScene) {
        scene = currentScene;
    }

    //reports what's in the queried location. 
    //returns componentType: water, land, duckling, duck, fox, croq, hawk, obstacle
    this.getNormalizedSquareInfo = function (x, y) {
        return grid[x - 1][y - 1];
    }

    //reports what's in the queried location. 
    //returns componentType: water, land, duckling, duck, fox, croq, hawk, obstacle
    //normalize input, then run above function
    this.getSquareInfo = function (z, x) {

        console.log("getSquareInfo: not implemented");
        return 0;
    }

    //reports value of queried square. 
    //takes center point coordiantes, componentType: water, land, duckling, duck, fox, croq, hawk, obstacle
    //returns componentType: water, land, duckling, duck, fox, croq, hawk, obstacle
    this.getActorsInRadius = function ({ x, z }, componentType) {

        console.log("getActorInRadius: not implemented");
        return 0;
    }

    //receives actor ID and updates the grid info, internally checks position
    this.updateActorInGrid = function (actorID, componentType) {

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

}