function assetGen(scene) {

    var tileSize = 9;

    var shadowMat = new THREE.ShadowMaterial({
        color: 0xff0000, transparent: true, opacity: 0.5
    });

    var corner = { "topLeft": 0, "topRight": 1, "bottomRight": 2, "bottomLeft": 3 };
    Object.freeze(playerState);

    this.buildEnv = function () {
        createWater();
        generateLand();

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
            console.log("ADD TOP");
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
            console.log("ADD BOTTOM");
            //if top corners not level, add 2 vertices
            if (corners[corner.bottomLeft][1] - corners[corner.bottomRight][1] != 0) {
                console.log("NOT EVEN");
                //pick random point in z, between the two corners
                var z = getRandomInt(corners[corner.bottomRight][0] - corners[corner.bottomLeft][0] - 2);
                z += corners[corner.bottomLeft][0];

                //add vertices to make right angle
                if (corner.bottomLeft[1] > corner.bottomRight[1]) {
                    vertices.push(new THREE.Vector2(z, corners[corner.bottomLeft][1]));
                    vertices.push(new THREE.Vector2(z, corners[corner.bottomRight][1]));
                }
                else {
                    vertices.push(new THREE.Vector2(z, corners[corner.bottomRight][1]));
                    vertices.push(new THREE.Vector2(z, corners[corner.bottomLeft][1]));
                }
            }
        }

        function addRight() {
            console.log("ADD RIGHT");
            //if top corners not level, add 2 vertices
            if (corners[corner.bottomRight][0] - corners[corner.topRight][0] != 0) {
                console.log("NOT EVEN");
                //pick random point in z, between the two corners
                var x = getRandomInt(corners[corner.bottomRight][1] - corners[corner.topRight][1] - 2);
                console.log("X: " + x);
                x += corners[corner.topRight][1];
                console.log("X AFTER: " + x);

                //add vertices to make right angle
                if (corner.bottomRight[0] > corner.topRight[0]) {
                    vertices.push(new THREE.Vector2(corners[corner.bottomRight][0], x));
                    vertices.push(new THREE.Vector2(corners[corner.topRight][0], x));
                }
                else {
                    vertices.push(new THREE.Vector2(corners[corner.topRight][0], x));
                    vertices.push(new THREE.Vector2(corners[corner.bottomRight][0], x));
                }
            }
        }

        function addLeft() {
            console.log("ADD RIGHT");
            //if top corners not level, add 2 vertices
            if (corners[corner.bottomLeft][0] - corners[corner.topLeft][0] != 0) {
                console.log("NOT EVEN");
                //pick random point in z, between the two corners
                var x = getRandomInt(corners[corner.bottomLeft][1] - corners[corner.topLeft][1] - 2);
                console.log("X: " + x);
                x += corners[corner.topLeft][1];
                console.log("X AFTER: " + x);

                //add vertices to make right angle
                if (corner.bottomLeft[0] > corner.topLeft[0]) {
                    vertices.push(new THREE.Vector2(corners[corner.topLeft][0], x));
                    vertices.push(new THREE.Vector2(corners[corner.bottomLeft][0], x));
                }
                else {
                    vertices.push(new THREE.Vector2(corners[corner.bottomLeft][0], x));
                    vertices.push(new THREE.Vector2(corners[corner.topLeft][0], x));
                }
            }
        }
    }


    function createWater() {
        var geo = new THREE.PlaneBufferGeometry(400, 400, 40, 40);
        var mat = new THREE.MeshLambertMaterial({ color: 0x0033ff, side: THREE.SingleSide });
        var water = new THREE.Mesh(geo, mat);
        water.rotation.x = Math.PI / 2 * 3;
        water.position.y -= 4;
        water.receiveShadow = true;
        water.shadowMaterial = shadowMat;
        scene.add(water);
    }


    //extrudes 2d shape in Y to form 3d shape
    function create3DGeo(shape) {
        var geo = new THREE.ExtrudeBufferGeometry(shape, { bevelEnabled: false, amount: 3 });
        var material = new THREE.MeshLambertMaterial({ color: 0x996633, wireframe: false });
        var mesh = new THREE.Mesh(geo, material);
        mesh.scale.set(10, 10, 1);
        mesh.rotation.x = Math.PI / 2;
        mesh.rotation.z = Math.PI / 2 * 3;
        mesh.position.z += 10;
        mesh.position.x -= 10;
        mesh.position.y -= 1;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.shadowMaterial = shadowMat;
        scene.add(mesh);
        return mesh;
    }

    //creates (25) 8x8 tiles to fill 40x40 grid
    function generateLand() {

        var gridSquares = 40 / (tileSize - 1);
        originZ = 210;
        originX = -120;

        //per level
        var marginArray = [1, 1, 1, 1];
        var connectOverrides = [1, 1, 1, 1];

        //per square
        var rangeArray = [2, 3, 3, 2];

        for (var i = 0; i < gridSquares; i++) {
            for (var j = 0; j < gridSquares; j++) {
                var corners = generateRandomCorners(rangeArray);
                var shape = create2DShape(corners);
                var landSquare = create3DGeo(shape);
                landSquare.position.z = originZ - (j * 8 * 10);
                landSquare.position.x -= originX + (i * 8 * 10);
            }
        }
    }


    //populates grid with land info by ray sampling
    function populateGrid() {

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