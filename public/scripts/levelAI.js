function levelAI(scene, clock, currentLevel, difficulty) {

    this.getState = getState;

    /*
    publish: level scores
    subscribe: userAction (nest)
    */
    var currentState;
    setState(levelState.init);

    var score;
    var assets = {};
    var originals = {};
    var player;
    var loader;

    var envGenerator;
    var levelAssetsLoaded = false;

    setupSubscriptions();
    setupPublications();
    determineAssets();
    loadAssets();
    //rest takes place in update()

    function setupSubscriptions() {
        bus.subscribe("invisibilitySkillRequested", processInvisibility());
        bus.subscribe("quackSkillRequested", processSuperquack());
    }

    function setupPublications() {
    }

    function setupSubscriptions() {
    }

    function determineAssets() {
    }

    function loadAssets() {
        loader = new assetLoader(scene);
    }

    function processInvisibility() {
        //if invisibility available
        grid.setInvisibility(true);
    }

    function processSuperquack() {
        //if quack available
        grid.setSuperquack(true);
    }


    function initAssetOriginals() {

        var duck = scene.getObjectByName("duck");
        console.log("duck: " + duck);
        duck.userData.componentType = componentType.duck;
        originals.duck = duck;

        var fox = scene.getObjectByName("fox");
        fox.userData.componentType = componentType.fox;
        originals.fox = fox;

        var croq = scene.getObjectByName("croq");
        croq.userData.componentType = componentType.croq;
        originals.croq = croq

        var duckling = scene.getObjectByName("duckling");
        duckling.userData.componentType = componentType.duckling;
        duckling.userData.callable = false;
        originals.duckling = duckling;

        var hawk = scene.getObjectByName("hawk");
        hawk.userData.componentType = componentType.hawk;
        hawk = new hawkAI(scene, clock, 0, hawk);
        originals.hawk = hawk;

        originals.grass = scene.getObjectByName("grass");

        var stick = scene.getObjectByName("stick");
        stick.userData.componentType = componentType.stick;
        originals.stick = stick;
    }

    //init prototypes, initLevelAssets
    function initLevelAssets() {
        envGenerator.buildEnv();
        grid.reset();

        //used for global updates
        var location = new THREE.Vector2(20, 20);
        placeAsset(originals.duck, componentType.duck, location, componentType.land);
        var playerCtrls = new playerControls(scene, clock, originals.duck);

        location = new THREE.Vector2(25, 25);
        placeAsset(originals.fox, componentType.fox, location, componentType.land);
        var fox_AI = new foxAI(scene, clock, 0, originals.fox);

        location = new THREE.Vector2(22, 22);
        placeAsset(originals.croq, componentType.croq, location, componentType.water);
        var croq_AI = new croqAI(scene, clock, 0, originals.croq);

        location = new THREE.Vector2(27, 22);
        placeAsset(originals.duckling, componentType.duckling, location, componentType.water);
        var duckling_AI = new ducklingAI(scene, clock, 0, originals.duckling);

        //placeAsset(grass, componentType.grass, location, componentType.land);

        location = new THREE.Vector2(25, 22);
        placeAsset(originals.stick, componentType.stick, location, componentType.land);

        levelAssetsLoaded = true;

    }


    function placeAsset(asset, assetComponent, location, locationComponent) {

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

        grid.addActor(asset);
        //grid.printGrid(0, 8, 0, 8);

    }

    function setState(state) {
        currentState = state;
    }

    function getState() {
        return currentState;
    }

    function endLevel() {
    }

    this.update = function () {

        var elapsedTime = clock.getElapsedTime();

        if (currentState === levelState.init) {
            if (typeof loader != 'undefined') {
                if (loader.checkAssetsLoaded() === true) {
                    envGenerator = new assetGen(scene);
                    initAssetOriginals();
                    setState(levelState.new);
                }
            }
        }

        if (currentState === levelState.new) {
            if (!levelAssetsLoaded) {
                initLevelAssets();
            }
            else {
                levelAssetsLoaded = false;
                setState(levelState.ready)
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

            //set all duckling.userData.callable = false (need to setup a pool)
            if (duck)
                grid.updateDucklingsInRadius(duck);

        }
        else {

        }
    }
}