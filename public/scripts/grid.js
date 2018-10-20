
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
    this.getSquareInfo = function (x, z) {

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

        console.log("setEnvSquare");
    }

    //checks if duckling is within duck's calling radius
    this.isInCallRadius = function (actorID) {

        console.log("isInCallRadius: not implemented");
        return 0;
    }

}