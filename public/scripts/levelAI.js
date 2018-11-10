function levelAI(scene) {

    this.getState = getState;
    this.setState = setState;
    this.updateSettings = updateSettings;

    /*
    publish: level scores
    subscribe: userAction (nest)
    */
    var currentState;
    setState(levelState.init);

    //should come straight from playerControler?
    var score;
    var actorsInLevel = [];
    var assetPools = init2DArray(13);
    var originals = {};
    var player;
    var loader;

    var currentLevel = 1;
    var invisibilityLevel = 0;
    var speedLevel = 0;
    var quackLevel = 0;

    var AIsActive = false;

    var envGenerator;
    var levelAssetsLoaded = false;

    setupSubscriptions();
    setupPublications();
    loadAssets();
    //rest takes place in update()

    function init2DArray(x) {
        var array = new Array(x);

        for (var i = 0; i < x; i++) {
            array[i] = new Array();
        }

        return array;
    }

    function updateSettings(settings) {
        currentLevel = settings.currentLevel;
        invisibilityLevel = settings.invisibilityLevel;
        speedLevel = settings.speedLevel;
        quackLevel = settings.quackLevel;
    }

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


    function initAssetPools() {

        var params;

        var duck = scene.getObjectByName("duck");
        var duckSize = 1;
        params = {
            count: duckSize,
            original: duck,
            scale: 10,
            componentType: componentType.duck,
        }
        createAssetPool(params);

        var fox = scene.getObjectByName("fox");
        var foxSize = 10;
        params = {
            count: foxSize,
            original: fox,
            scale: 12,
            componentType: componentType.fox,
        }
        createAssetPool(params);

        var croq = scene.getObjectByName("croq");
        var croqSize = 10;
        params = {
            count: croqSize,
            original: croq,
            scale: 1,
            componentType: componentType.croq,
        }
        //createAssetPool(params);

        var egg = scene.getObjectByName("egg");
        var eggSize = 10;
        params = {
            count: eggSize,
            original: egg,
            scale: 1,
            componentType: componentType.egg,
        }
        //createAssetPool(params);

        var duckling = scene.getObjectByName("duckling");
        var ducklingSize = 10;
        params = {
            count: ducklingSize,
            original: duckling,
            scale: 1,
            componentType: componentType.duckling,
        }
        //createAssetPool(params);

        var hawk = scene.getObjectByName("hawk");
        var hawkSize = 10;
        params = {
            count: hawkSize,
            original: hawk,
            scale: 1,
            componentType: componentType.hawk,
        }
        //createAssetPool(params);

        var stick = scene.getObjectByName("stick");
        var stickSize = 10;
        params = {
            count: stickSize,
            original: stick,
            scale: 1,
            componentType: componentType.stick,
        }
        //createAssetPool(params);
    }

    function createAssetPool(params) {

        for (var i = 0; i < params.count; i++) {

            var obj = {};
            obj.asset = new THREE.Object3D();

            params.original.traverse(function (child) {

                if (child instanceof THREE.Mesh) {
                    var childClone = child.clone();
                    obj.asset.add(childClone);
                }
                obj.asset.scale.x = params.scale;
                obj.asset.scale.y = params.scale;
                obj.asset.scale.z = params.scale;
                obj.asset.userData.componentType = params.componentType;
                obj.asset.position.y = -100;
                scene.add(obj.asset);

            });

            var instance;
            switch (params.componentType) {
                case componentType.duck:
                    instance = new playerControls(scene, obj.asset);
                    break;
                case componentType.fox:
                    instance = new foxAI(scene, obj.asset);
                    break;
                case componentType.croq:
                    instance = new croqAI(scene, obj.asset);
                    break;
                case componentType.hawk:
                    instance = new hawkAI(scene, obj.asset);
                    break;
                case componentType.duckling:
                    instance = new ducklingAI(scene, obj.asset);
                    break;
            }

            assetPools[params.componentType].push({ instance: instance, asset: obj.asset });
            //console.log(assetPools[params.componentType][i]);
        }
    }


    function populateAssets() {

        //rest to zero
        var defaultLocation = new THREE.Vector2(20, 20);

        var foxCount = 0;
        var hawkCount = 0;
        var croqCount = 0;
        var ducklingCount = 0;
        var stickCount = 0;
        var duckCount = 1;

        //TO DO: add rotation, not always down, will affect object mover
        var duckLocations = [(new THREE.Vector2(20, 20))]
        var duck = {
            count: duckCount,
            locations: duckLocations,
            locationComponent: componentType.land,
            componentType: componentType.duck
        }

        var foxLocations = [(new THREE.Vector2(25, 25)), (new THREE.Vector2(30, 30))]
        var foxes = {
            count: foxCount,
            componentType: componentType.fox,
            locations: foxLocations,
            locationComponent: componentType.land
        }

        var hawkLocations = [(new THREE.Vector2(27, 25))]
        var hawks = {
            count: hawkCount,
            componentType: componentType.hawk,
            locations: hawkLocations,
            //TO DO: air i.e. special case
            locationComponent: componentType.air
        }

        var croqLocations = [(new THREE.Vector2(27, 25)),
        (new THREE.Vector2(35, 35)),
        (new THREE.Vector2(5, 5)),
        (new THREE.Vector2(15, 5)),
        (new THREE.Vector2(25, 10))]

        var croqs = {
            count: croqCount,
            componentType: componentType.croq,
            locations: croqLocations,
            locationComponent: componentType.water
        }

        var ducklingLocations = [(new THREE.Vector2(20, 25)),
        (new THREE.Vector2(35, 15)),
        (new THREE.Vector2(25, 5)),
        (new THREE.Vector2(25, 15)),
        (new THREE.Vector2(25, 10))]

        var ducklings = {
            count: ducklingCount,
            componentType: componentType.duckling,
            locations: ducklingLocations,
            locationComponent: componentType.land
        }

        var stickLocations = [(new THREE.Vector2(20, 25)),
        (new THREE.Vector2(35, 15)),
        (new THREE.Vector2(25, 5)),
        (new THREE.Vector2(25, 15))]

        var sticks = {
            count: stickCount,
            componentType: componentType.stick,
            locations: stickLocations,
            locationComponent: componentType.land
        }

        spawnAsset(duck);
        spawnAsset(foxes);
        spawnAsset(hawks);
        spawnAsset(croqs);
        spawnAsset(ducklings);
        spawnAsset(sticks);

    }

    function spawnAsset(params) {

        for (var i = 0; i < params.count; i++) {

            var obj = assetPools[params.componentType][i];
            actorsInLevel.push(obj);

            obj.asset.userData.location = params.locations[i];
            obj.asset.userData.locationComponent = params.locationComponent;

            placeAsset(obj.asset);

            /*
            if (params.componentType === componentType.duckling) {
                obj.asset.userData.callable = false;
            }
            */
        }
    }

    function despawn() {
        for (var i = 0; i < assetPools.length; i++) {
            for (var j = 0; j < assetPools[i].length; j++) {
                assetPools[i][j].asset.position.y = -100;
            }
        }
    }

    //init prototypes, initLevelAssets
    function buildLevel() {

        //TO DO: load setup struct based on level from config.js
        //var levelSettings = config(currentLevel);
        var levelSettings = 0;
        envGenerator.buildEnv(levelSettings);
        populateAssets();

        levelAssetsLoaded = true;

    }


    function placeAsset(asset) {

        var location = asset.userData.location;
        var locationComponent = asset.userData.locationComponent;

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
        asset.position.y = .1;

        grid.addActor(asset);
        //grid.printGrid(0, 8, 0, 8);

    }

    function setState(state) {
        currentState = state;
    }

    function getState() {
        return currentState;
    }

    function setAIActiveState(state) {
        for (var i = 0; i < actorsInLevel.length; i++) {
            if (actorsInLevel[i].instance !== undefined) {
                actorsInLevel[i].instance.setActive(state);
            }
        }
    }

    function cleanup() {
        despawn();
        grid.reset();
        //object gets deleted, but scene elements remain otherwise
        envGenerator.cleanup();
        AIsActive = false;
        playerAI.reset();
    }

    var playerAI = {};

    this.update = function () {

        var elapsedTime = clock.getElapsedTime();

        if (currentState === levelState.init) {
            if (typeof loader != 'undefined') {
                if (loader.checkAssetsLoaded() === true) {
                    envGenerator = new assetGen(scene);
                    initAssetPools();
                    setState(levelState.preGame);
                }
            }
        }

        if (currentState === levelState.build) {
            if (!levelAssetsLoaded) {
                buildLevel();
                playerAI = actorsInLevel[0].instance;
            }
            else {
                levelAssetsLoaded = false;
                setState(levelState.ready)
                playerAI.setState(playerState.ready);
            }
        }

        if (currentState === levelState.play) {
            //start duck and all AIs

            //TO DO: replace this with better toggle for pause/continue, game start only for now
            if (!AIsActive) {
                setAIActiveState(true);
                AIsActive = true;
                //grid.printGrid(15, 25, 20, 30);
            }

            //get duck's state
            if (playerAI.getState() === playerState.dead) {
                setState(levelState.loss);
                cleanup();
            }
            else if (playerAI.getState() === playerState.won) {
                setState(levelState.end);
                cleanup();
            }
            else {
                for (var i = 0; i < actorsInLevel.length; i++) {
                    if (actorsInLevel[i].instance !== undefined) {
                        actorsInLevel[i].instance.update();
                    }
                }
            }

            //set all duckling.userData.callable = false (need to setup a pool)
            //if (duck)
            //   grid.updateDucklingsInRadius(duck);

        }

        if (currentState === levelState.pause) {
            setAIActiveState(false);
            setState(levelState.waiting);
        }

        if (currentState === levelState.continue) {
            setAIActiveState(true);
            setState(levelState.play);
        }
    }
}