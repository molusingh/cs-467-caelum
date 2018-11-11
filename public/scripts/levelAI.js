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
                    console.log("UUID: " + obj.asset.uuid);
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

            assetPools[params.componentType].push(instance)
        }
    }


    function populateAssets() {

        //rest to zer
        var defaultLocation = new THREE.Vector2(20, 20);

        var foxCount = 1;
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
            locationComponent: componentType.land,
            componentType: componentType.fox
        }

        var hawkLocations = [(new THREE.Vector2(27, 25))]
        var hawks = {
            count: hawkCount,
            componentType: componentType.hawk,
            locations: hawkLocations,
            //TO DO: air i.e. special case
            locationComponent: componentType.air,
            componentType: componentType.hawk
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
            locationComponent: componentType.water,
            componentType: componentType.croq
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
            locationComponent: componentType.land,
            componentType: componentType.duckling
        }

        var stickLocations = [(new THREE.Vector2(20, 25)),
        (new THREE.Vector2(35, 15)),
        (new THREE.Vector2(25, 5)),
        (new THREE.Vector2(25, 15))]

        var sticks = {
            count: stickCount,
            componentType: componentType.stick,
            locations: stickLocations,
            locationComponent: componentType.land,
            componentType: componentType.stick
        }

        spawnAsset(duck);
        spawnAsset(foxes);
        /*
        spawnAsset(hawks);
        spawnAsset(croqs);
        spawnAsset(ducklings);
        spawnAsset(sticks);
        */

    }

    function spawnAsset(params) {

        console.log("count: " + params.count);

        for (var i = 0; i < params.count; i++) {

            actorsInLevel.push(assetPools[params.componentType][i]);

            var pos = actorsInLevel.length - 1;

            actorsInLevel[pos].getActor().userData.locationComponent = params.locationComponent;
            actorsInLevel[pos].getActor().userData.location = params.locations[i];

            actorsInLevel[pos].spawn();

        }
    }

    function despawn() {
        for (var i = 0; i < actorsInLevel.length; i++) {
            actorsInLevel[i].getActor().position.y = -100;
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



    function setState(state) {
        currentState = state;
    }

    function getState() {
        return currentState;
    }

    function setAIActiveState(state) {
        for (var i = 0; i < actorsInLevel.length; i++) {
            if (actorsInLevel[i] !== undefined) {
                actorsInLevel[i].setActive(state);
            }
        }
    }

    function initAIs() {
        for (var i = 0; i < actorsInLevel.length; i++) {
            if (actorsInLevel[i] !== undefined &&
                actorsInLevel[i].getActor().userData.componentType !== componentType.duck) {
                //console.log(actorsInLevel[i].asset.userData.componentType);
                actorsInLevel[i].init();
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
                playerAI = actorsInLevel[0];
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
                initAIs();
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
                    if (actorsInLevel[i] !== undefined) {
                        actorsInLevel[i].update();
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