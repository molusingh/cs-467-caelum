function assetGen(scene) {

    var tileSize = 9;
    var landObjects = [];

    var shadowMat = new THREE.ShadowMaterial({
        color: 0xff0000, transparent: true, opacity: 0.5
    });

    var corner = { "topLeft": 0, "topRight": 1, "bottomRight": 2, "bottomLeft": 3 };
    Object.freeze(playerState);

    this.buildEnv = function () {
        createWater();
        generateLand();
        recordLandInGrid();
        //grid.printGrid(0, 8, 0, 8);
        generateLandObstacles(40, 20);
        generateGrassObstacles(60, 20);
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

            //console.log("VERTICES:");
            for (var i = 0; i < vertices.length; i++) {
                //console.log(i + ": " + vertices[i].x + " " + vertices[i].y);
            }

            var shape = new THREE.Shape(vertices);
            return shape;
        }

        function addTop() {
            //if top corners not level, add 2 vertices
            if (corners[corner.topRight][1] - corners[corner.topLeft][1] != 0) {
                //pick random point in z, between the two corners
                var z = getRandomInt(corners[corner.topRight][0] - corners[corner.topLeft][0] - 2);
                z += corners[corner.topLeft][0];

                //add vertices to make right angle
                vertices.push(new THREE.Vector2(z, corners[corner.topLeft][1]));
                vertices.push(new THREE.Vector2(z, corners[corner.topRight][1]));
            }
        }

        function addBottom() {
            //if top corners not level, add 2 vertices
            if (corners[corner.bottomLeft][1] - corners[corner.bottomRight][1] != 0) {
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
            //if top corners not level, add 2 vertices
            if (corners[corner.bottomRight][0] - corners[corner.topRight][0] != 0) {
                //pick random point in z, between the two corners
                var x = getRandomInt(corners[corner.bottomRight][1] - corners[corner.topRight][1] - 2);
                x += corners[corner.topRight][1];

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
            //if top corners not level, add 2 vertices
            if (corners[corner.bottomLeft][0] - corners[corner.topLeft][0] != 0) {
                //pick random point in z, between the two corners
                var x = getRandomInt(corners[corner.bottomLeft][1] - corners[corner.topLeft][1] - 2);
                x += corners[corner.topLeft][1];

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
        water.position.y -= 3;
        water.receiveShadow = true;
        water.shadowMaterial = shadowMat;
        scene.add(water);
    }


    //extrudes 2d shape in Y to form 3d shape
    function create3DGeo(shape) {
        var geo = new THREE.ExtrudeBufferGeometry(shape, { bevelEnabled: false, depth: 3 });
        var material = new THREE.MeshLambertMaterial({ color: 0x996633, wireframe: false });
        var mesh = new THREE.Mesh(geo, material);
        mesh.scale.set(10, 10, 1);
        mesh.rotation.x = Math.PI / 2;
        mesh.rotation.z = Math.PI / 2 * 3;
        mesh.position.z += 10;
        mesh.position.x -= 10;
        mesh.position.y -= 0.1;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.shadowMaterial = shadowMat;
        mesh.userData = { type: componentType.land };
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

                landObjects.push(landSquare);
            }
        }

    }


    //populates grid with land info by ray sampling
    function recordLandInGrid() {
        for (var i = 0; i < 40; i++) {
            for (var j = 0; j < 40; j++) {
                var vector = new THREE.Vector2(i, j);
                var isLand = identifyObject(vector, landObjects);
                if (isLand === 1) {
                    grid.setEnvSquare(i, j, componentType.land);
                }
            }
        }
    }


    function identifyObject(gridLocation) {

        var raycaster = new THREE.Raycaster();
        var intersects;
        var direction = new THREE.Vector3();
        var far = new THREE.Vector3();

        var originY = -200;
        var originX = 200;

        var y = originY + (gridLocation.y * 10) + 5;
        var x = originX - (gridLocation.x * 10) - 5;

        var geometry = new THREE.SphereGeometry(2, 32, 32);
        var material = new THREE.MeshLambertMaterial({ color: 0xffff00 });

        var origin = new THREE.Mesh(geometry, material);
        origin.position.set(y, 20, x)
        origin.name = "rayOrigin";
        scene.add(origin);

        var destination = new THREE.Mesh(geometry, material);
        destination.position.set(y, -20, x)
        destination.name = "rayDestination";
        scene.add(destination);

        raycaster.set(origin.position, direction.subVectors(destination.position, origin.position).normalize());
        raycaster.far = far.subVectors(destination.position, origin.position).length();

        remove(destination.name);
        remove(origin.name);

        for (var x = 0; x < landObjects.length; x++) {
            landObjects[x].updateMatrixWorld();
        }

        intersects = raycaster.intersectObjects(landObjects);
        if (intersects.length > 0) {
            return 1;
        }
        else {
            return 0;
        }

    }


    function remove(name) {
        scene.remove(scene.getObjectByName(name));
    }


    //creates 1x1 - 3x3 obstacles on land, continuous
    function generateGrassObstacles(minimum, random) {
        var numOfGrassPatches = getRandomInt(random) + minimum;

        var grass = scene.getObjectByName("grass");
        var material = new THREE.MeshLambertMaterial({ color: 0x006600, wireframe: false });

        var cube = new THREE.CubeGeometry(1, 1, 1);
        cube.applyMatrix(new THREE.Matrix4().makeTranslation(0.5, 0.5, -0.5));
        //var material = new THREE.MeshLambertMaterial({ color: 0x996633, wireframe: false });


        for (var i = 0; i < numOfGrassPatches; i++) {

            var randomRotationY;

            var size = new THREE.Vector2(1, 1);

            //patch = new THREE.Mesh(grass.clone(), material);
            patch = grass.clone();
            patch.position.y -= 0.1;
            patch.castShadow = true;
            patch.receiveShadow = true;
            patch.shadowMaterial = shadowMat;
            scene.add(patch);

            var offset = new THREE.Vector2(5, 5);

            var object = {
                'geo': patch,
                'size': size,
                'offset': offset,
                'objectComponent': componentType.grass,
                'placementComponent': componentType.land
            };

            placeRandom(object);

        }

    }


    //creates 1x1 - 3x3 obstacles on land, continuous
    function generateLandObstacles(minimum, random) {
        var numOfObstacles = getRandomInt(random) + minimum;

        var cube = new THREE.CubeGeometry(1, 1, 1);
        cube.applyMatrix(new THREE.Matrix4().makeTranslation(0.5, 0.5, -0.5));
        var material = new THREE.MeshLambertMaterial({ color: 0x996633, wireframe: false });

        for (var i = 0; i < numOfObstacles; i++) {

            var randomSizeX, randomSizeY;
            var randomLocationX, randomLocationY;

            randomSizeX = getRandomInt(3);
            randomSizeY = getRandomInt(3);

            var size = new THREE.Vector2(randomSizeX, randomSizeY);

            obstacle = new THREE.Mesh(cube.clone(), material);
            obstacle.scale.set(10 * randomSizeY, 8, 10 * randomSizeX);
            obstacle.position.y -= 0.1;
            obstacle.castShadow = true;
            obstacle.receiveShadow = true;
            obstacle.shadowMaterial = shadowMat;
            scene.add(obstacle);

            var offset = new THREE.Vector2(10, 10);

            var object = {
                'geo': obstacle,
                'size': size,
                'offset': offset,
                'objectComponent': componentType.obstacle,
                'placementComponent': componentType.land
            };

            placeRandom(object);

        }

    }


    function placeRandom(object) {

        var originY = -200;
        var originX = 200;

        //is space under future obstacle all land
        var isLegal = false;
        //add cut off for 100 attempts
        var attempts = 0;

        while (isLegal === false) {

            attempts++;

            randomLocationX = getRandomInt(40 - object.size.x);
            randomLocationY = getRandomInt(40 - object.size.y);

            var location = new THREE.Vector2(randomLocationX, randomLocationY);

            isLegal = grid.blockIsComponent(object.size, location, object.placementComponent);

            if (attempts > 100) {
                break;
            }
        }

        //next obstacle
        if (attempts > 100)
            return;

        var y = originY + (randomLocationY * 10) - object.offset.y;
        var x = originX - (randomLocationX * 10) + object.offset.x;

        object.geo.position.z = x;
        object.geo.position.x = y;

        registerInGrid(object.size, location, object.objectComponent);

    }


    function registerInGrid(size, location, component) {
        for (var i = location.x; i < location.x + size.x; i++) {
            for (var j = location.y; j < location.y + size.y; j++) {
                grid.setEnvSquare(i - 1, j - 1, component);
            }
        }
    }

}