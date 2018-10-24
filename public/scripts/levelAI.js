function levelAI(scene, clock, currentLevel, difficulty) {
    
    this.getState = getState;

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

        var duck = scene.getObjectByName("duck");
        var location = new THREE.Vector2(20, 20);
        placeAsset(duck, componentType.duck, location, componentType.land);
        player = new playerControls(scene, clock, duck);

        var fox = scene.getObjectByName("fox");
        location = new THREE.Vector2(25, 25);
        placeAsset(fox, componentType.fox, location, componentType.land);
        fox = new foxAI(scene, clock, 0, fox);

        var croq = scene.getObjectByName("croq");
        location = new THREE.Vector2(22, 22);
        placeAsset(croq, componentType.croq, location, componentType.water);
        croq = new croqAI(scene, clock, 0, croq);

        var duckling = scene.getObjectByName("duckling");
        location = new THREE.Vector2(27, 22);
        placeAsset(duckling, componentType.duckling, location, componentType.water);
        duckling = new ducklingAI(scene, clock, 0, duckling);

        var hawk = scene.getObjectByName("hawk");
        hawk = new hawkAI(scene, clock, 0, hawk);

    }


    function placeAsset(asset, assetComponent, location, locationComponent) {

        var searchFailed = false;
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
                        console.log("true 92");
                        return testLocation;
                    }
                }

                for (var i = location.x - radius; i <= location.x + radius; i++) {
                    testLocation.x = i;
                    testLocation.y = location.y - radius;
                    validLocation = grid.blockIsComponent(size, testLocation, locationComponent);
                    if (validLocation === true) {
                        console.log("true 102");
                        return testLocation;
                    }
                }
                for (var i = location.y - radius; i <= location.y + radius; i++) {
                    testLocation.x = location.x + radius;
                    testLocation.y = i;
                    validLocation = grid.blockIsComponent(size, testLocation, locationComponent);
                    if (validLocation === true) {
                        console.log("true 111");
                        return testLocation;
                    }
                }
                for (var i = location.y - radius; i <= location.y + radius; i++) {
                    testLocation.x = location.x - radius;
                    testLocation.y = i;
                    validLocation = grid.blockIsComponent(size, testLocation, locationComponent);
                    if (validLocation === true) {
                        console.log("true 120");
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
        console.log(assetLocation.x, assetLocation.y);
        console.log("asset: " + asset.name);

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

        grid.setEnvSquare(assetLocation.x - 1, assetLocation.y - 1, assetComponent);
        //grid.printGrid(0, 8, 0, 8);

    }

    function setState(state) {
        currentState = state;
    }
    
    function getState()
    {
        return currentState;
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