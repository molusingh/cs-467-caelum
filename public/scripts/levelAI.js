function levelAI(scene, clock, currentLevel, difficulty) {

    /*
    publish: level scores
    subscribe: userAction (nest)
    */
    var currentState;
    setState(levelState.init);

    var score;
    var levelAI, userInterface;
    var assetArray;
    var player;
    var loader;

    setupSubscriptions();
    setupPublications();
    determineAssets();
    loadAssets();

    function setupSubscriptions() {
    }

    function setupPublications() {
    }

    function determineAssets() {
    }

    function loadAssets() {

        envGenerator = new assetGen(scene);
        envGenerator.buildEnv();

        loader = new assetLoader(scene);
        //load env here
    }


    function initAssets() {

        placeAsset();

        var duck = scene.getObjectByName("duck");
        duck.position.x += 5;
        duck.position.z += 5;
        player = new playerControls(scene, clock, duck);

        var fox = scene.getObjectByName("fox");
        fox = new foxAI(scene, clock, 0, fox);

        var croq = scene.getObjectByName("croq");
        croq = new croqAI(scene, clock, 0, croq);

        var duckling = scene.getObjectByName("duckling");
        duckling = new ducklingAI(scene, clock, 0, duckling);

        var hawk = scene.getObjectByName("hawk");
        hawk = new hawkAI(scene, clock, 0, hawk);

    }


    //function placeAsset(asset, component, location) {
    function placeAsset() {

        var location = new THREE.Vector2(1, 1);
        var size = new THREE.Vector2(1, 1);

        console.log("BEFORE: ");
        var isValidLocation = grid.blockIsComponent(size, location, componentType.land);
        console.log("isVALIDLOC: " + isValidLocation);
        var validLocation = new THREE.Vector2(1, 1);

        if (!isValidLocation) {
            for (var i = location.x - 2; i < location.x + 3; i++) {
                for (var j = location.y - 2; j < location.y + 3; j++) {
                    validLocation.x = i;
                    validLocation.y = j;

                    isValidLocation = grid.blockIsComponent(size, validLocation, componentType.land);
                    if (isValidLocation) {
                        i = 4;
                        j = 4;
                    }
                }
            }
        }

        var cube = new THREE.CubeGeometry(10, 10, 10);
        var material = new THREE.MeshLambertMaterial({ color: 0xff0000, wireframe: false });
        asset = new THREE.Mesh(cube, material);
        scene.add(asset);

        var originY = -200;
        var originX = 200;

        var y = originY + (validLocation.y * 10) - 10;
        var x = originX - (validLocation.x * 10) + 10;

        asset.position.z = x;
        asset.position.x = y;

        console.log("validLocation: " + validLocation.x);

        grid.setEnvSquare(validLocation.x - 1, validLocation.y - 1, componentType.grass);
    }

    function setState(state) {
        currentState = state;
    }

    function endLevel() {
    }

    this.update = function () {

        var elapsedTime = clock.getElapsedTime();

        if (currentState === levelState.init) {
            if (typeof loader != 'undefined') {
                if (loader.checkAssetsLoaded() === true) {
                    initAssets();
                    setState(levelState.ready);
                }
            }
        }

        if (currentState === levelState.play) {
            switch (playerState.getState()) {
                case playerState.ready:
                    player.start();
                    break;
                case playerState.play:
                    player.update();
                    break;
                default:
                    break;
            }
            playerControler.update();
        }
        else {

        }
    }
}