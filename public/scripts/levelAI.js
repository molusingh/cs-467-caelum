function levelAI(scene, clock, currentLevel, difficulty) {

    this.getState = getState;

    /*
    publish: level scores
    subscribe: userAction (nest)
    */
    var currentState;
    setState(levelState.init);

    var score;
    var assets = [];
    var assetInstances = [];
    var originals = {};
    var player;
    var loader;

    var envGenerator;
    var levelAssetsLoaded = false;

    setupSubscriptions();
    setupPublications();
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
        console.log("duck: " + duck.position);
        duck.userData.componentType = componentType.duck;
        originals.duck = duck;

        var fox = scene.getObjectByName("fox");
        fox.userData.componentType = componentType.fox;
        originals.fox = fox;

        var croq = scene.getObjectByName("croq");
        croq.userData.componentType = componentType.croq;
        originals.croq = croq

        var egg = scene.getObjectByName("egg");
        //careful
        egg.userData.componentType = componentType.egg;
        originals.egg = egg;

        var duckling = scene.getObjectByName("duckling");
        duckling.userData.componentType = componentType.duckling;
        duckling.userData.callable = false;
        originals.duckling = duckling;

        var hawk = scene.getObjectByName("hawk");
        hawk.userData.componentType = componentType.hawk;
        originals.hawk = hawk;

        var grass = scene.getObjectByName("grass");
        grass.userData.componentType = componentType.grass;
        originals.grass = grass;

        var stick = scene.getObjectByName("stick");
        stick.userData.componentType = componentType.stick;
        originals.stick = stick;
    }


    function determineAssets() {

        //fast rest
        assets.length = 0;
        var defaultLocation = new THREE.Vector2(20, 20);

        var foxCount = 2;
        var hawkCount = 1;
        var croqCount = 5;
        var ducklingCount = 5;
        var stickCount = 5;
        var duckCount = 1;

        for (var i = 0; i < duckCount; i++) {
            var obj = {};
            obj.asset = new THREE.Mesh(originals.duck.clone(), originals.duck.material);
            obj.location = new THREE.Vector2(25, 25);
            obj.locationComponent = componentType.land;
            assets.push(obj);
        }

        return assets;
    }

    //init prototypes, initLevelAssets
    function initLevelAssets() {

        //TO DO: setup struct based on diff from gameAI
        var settings = 0;
        envGenerator.buildEnv(settings);
        grid.reset();
        assets = determineAssets();

        for (var i = 0; i < assets.length; i++) {

            var obj = assets[i];

            placeAsset(obj);

            switch (obj.asset.userData.componentType) {
                case componentType.duck:
                    assetInstances.push(new playerControls(scene, obj.asset))
                    break;
                case componentType.duckling:
                    assetInstances.push(new ducklingAI(scene, obj.asset))
                    break;
                case componentType.fox:
                    assetInstances.push(new foxAI(scene, obj.asset))
                    break;
                case componentType.hawk:
                    assetInstances.push(new hawkAI(scene, obj.asset))
                    break;
                case componentType.croq:
                    assetInstances.push(new croqAI(scene, obj.asset))
                    break;
            }

        }

        levelAssetsLoaded = true;

        /*
        location = new THREE.Vector2(20, 20);
        placeAsset(originals.duck, componentType.duck, location, componentType.land);
        var playerCtrls = new playerControls(scene, originals.duck);

        location = new THREE.Vector2(25, 25);
        placeAsset(originals.fox, componentType.fox, location, componentType.land);
        var fox_AI = new foxAI(scene, originals.fox);

        location = new THREE.Vector2(22, 22);
        placeAsset(originals.croq, componentType.croq, location, componentType.water);
        var croq_AI = new croqAI(scene, originals.croq);

        location = new THREE.Vector2(27, 22);
        placeAsset(originals.duckling, componentType.duckling, location, componentType.water);
        var duckling_AI = new ducklingAI(scene, originals.duckling);

        location = new THREE.Vector2(27, 22);
        var hawk_AI = new hawkAI(scene, originals.hawk);
        placeAsset(originals.hawk, componentType.hawk, location, componentType.air);

        //placeAsset(grass, componentType.grass, location, componentType.land);

        location = new THREE.Vector2(25, 22);
        placeAsset(originals.stick, componentType.stick, location, componentType.land);

        levelAssetsLoaded = true;
        */


    }


    function placeAsset(assetObj) {

        var asset = assetObj.asset;
        var location = assetObj.location;
        var locationComponent = assetObj.locationComponent;

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