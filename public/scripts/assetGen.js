function assetGen(scene) {

    var tileSize = 8;

    var corner = { "topLeft": 0, "topRight": 1, "bottomRight": 2, "bottomLeft": 3 };
    Object.freeze(playerState);

    this.buildEnv = function () {

        //per level
        var marginArray = [1, 1, 1, 1];
        var connectOverrides = [1, 1, 1, 1];

        //per square
        var rangeArray = [2, 3, 3, 2];

        var corners = generateRandomCorners(rangeArray);
        console.log("CORNERS: ");
        console.log("topLeft: " + corners[0]);
        console.log("topRight: " + corners[1]);
        console.log("bottomRight " + corners[2]);
        console.log("bottomLeft: " + corners[3]);

        create2DShape(corners);

    }

    //creates 4 points determining corners of 8x8 tile
    function generateRandomCorners(rangeArray) {

        //TO DO: Add margins to array (Top, Left, Right, Bottom);

        var rangeTopLeft = rangeArray[0];
        var rangeTopRight = rangeArray[1];
        var rangeBottomRight = rangeArray[2];
        var rangeBottomLeft = rangeArray[3];

        var topLeft = [getRandomInt(rangeTopLeft), getRandomInt(rangeTopLeft)];
        var topRight = [getRandomInt(rangeTopRight) + tileSize - rangeTopRight, getRandomInt(rangeTopRight)];
        var bottomRight = [getRandomInt(rangeBottomRight) + tileSize - rangeBottomRight, getRandomInt(rangeBottomRight) + tileSize - rangeBottomRight];
        var bottomLeft = [getRandomInt(rangeBottomLeft), getRandomInt(rangeBottomLeft) + tileSize - rangeBottomLeft];

        return [topLeft, topRight, bottomRight, bottomLeft];
    }

    //creates a 2d shape from 4 corners provided
    function create2DShape(corners) {

        var vertices = [];

        for (var i = 0; i < corners.length; i++) {

            //add corner to shape vertices
            vertices.push(new THREE.Vector2(corners[i][0], corners[i][1]));

            //create additional vertices as needed to preserve right angles
            switch (i) {
                case corner.topLeft:
                    addTop();
                    break;

                case corner.topRight:
                    addRight();
                    break;

                case corner.bottomRight:
                    addBottom();
                    break;

                case corner.bottomLeft:
                    addLeft();
                    break;

                default:
                    break;
            }
        }

        return createShape();


        function createShape() {

            console.log("VERTICES:");
            for (var i = 0; i < vertices.length; i++) {
                console.log(i + ": " + vertices[i].x + " " + vertices[i].y);
            }

            var shape = new THREE.Shape(vertices);
            return shape;
        }

        function addTop() {
            console.log("ADD TOP")
            //if top corners not level, add 2 vertices
            console.log("topRight x: " + corners[corner.topRight][1]);
            console.log("topLeft x: " + corners[corner.topLeft][1]);
            if (corners[corner.topRight][1] - corners[corner.topLeft][1] != 0) {
                console.log("NOT EVEN")
                //pick random point in z, between the two corners
                var z = getRandomInt(corners[corner.topRight][0] - corners[corner.topLeft][0] - 2);
                z += corners[corner.topLeft][0];

                //add vertices to make right angle
                vertices.push(new THREE.Vector2(z, corners[corner.topLeft][1]));
                vertices.push(new THREE.Vector2(z, corners[corner.topRight][1]));
            }
        }

        function addBottom() {

        }

        function addRight() {

        }

        function addLeft() {

        }
    }


    //extrudes 2d shape in Y to form 3d shape
    function create3DShape() {

    }

    //creates (25) 8x8 tiles to fill 40x40 grid
    function generateLand() {

    }


    //populates grid with land info by ray sampling
    function populateLand() {

    }

    //creates 1x1 - 3x3 obstacles on land, continuous
    function generateLandObstacles(count) {

    }

    //creates 1x1 - 4x4 obstacles on land, not continous, doesn't grow on land obstacles
    function generateGrassObstacles(count) {

    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max) + 1);
    }

}