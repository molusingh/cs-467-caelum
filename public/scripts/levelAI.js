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
        //duck.position.x += 5;
        //duck.position.z += 5;
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


    function placeAsset(asset, assetComponent, location, locationComponent) {

        var findValidSquare = function (testLocation) {
            var radius = 0;
            if (findLocation(testLocation, radius, locationComponent).x == - 1) {
                return findValidSquare(findLocation(testLocation, radius + 1, locationComponent));
            } else {
                return findLocation(testLocation, radius, locationComponent);
            }
        };

        function findLocation(location, radius, locationComponent) {
            var size = new THREE.Vector2(1, 1);
            var testLocation = new THREE.Vector2(1, 1);

            for (var i = location.x - radius; i <= location.x + radius; i++) {
                for (var j = location.y - radius; j <= location.y + radius; j++) {
                    testLocation.x = i;
                    testLocation.y = j;

                    isValidLocation = grid.blockIsComponent(size, testLocation, locationComponent);
                    if (isValidLocation) {
                        return testLocation;
                    }
                }
            }

            var fail = new THREE.Vector2(-1, -1);
            return fail;
        }

        var validLocation = findValidSquare(location);

        scene.add(asset);

        var originY = -200;
        var originX = 200;

        var y = originY + (validLocation.y * 10) - 5;
        var x = originX - (validLocation.x * 10) + 5;

        asset.position.z = x;
        asset.position.x = y;

        grid.setEnvSquare(validLocation.x - 1, validLocation.y - 1, assetComponent);
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