function levelAI(scene) {

    this.getState = getState;
    this.setState = setState;
    this.updateSettings = updateSettings;

    var currentState;
    setState(levelState.init);

    //should come straight from playerControler?
    var score;
    var actorsInLevel = [];
    var pawnsInLevel = [];
    var assetPools = init2DArray(13);
    var loader;
    var ducklingsSpawned = 0;
    var ducklingsDead = 0;
    var ducklingsNested = 0;

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
        //bus.subscribe("quackSkillRequested", processSuperquack());
        //bus.subscribe("ducklingDead", test);
        bus.subscribe("ducklingDead", addDead);
        bus.subscribe("ducklingNested", addNested);
    }

    function addNested() {
        ducklingsNested++;
        checkDucklings();
    }

    function addDead(actor) {
        removeActor(actor);
        ducklingsDead++;
        checkDucklings();
    }

    function checkDucklings() {

        if (ducklingsDead + ducklingsNested == ducklingsSpawned) {
            currentState = levelState.end;
            cleanup();
        }
    }

    function setupPublications() {
    }

    function loadAssets() {
        loader = new assetLoader(scene);
    }

    /*
    function processInvisibility() {
        //if invisibility available
        grid.setInvisibility(true);
    }

    function processSuperquack() {
        //if quack available
        grid.setSuperquack(true);
    }
    */

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
        createAssetPool(params);

        var duckling = scene.getObjectByName("duckling");
        var egg = scene.getObjectByName("egg");
        var ducklingSize = 10;
        params = {
            count: ducklingSize,
            original: duckling,
            scale: 1,
            componentType: componentType.duckling,
            egg: egg
        }
        createAssetPool(params);

        var hawk = scene.getObjectByName("hawk");
        var hawkSize = 10;
        params = {
            count: hawkSize,
            original: hawk,
            scale: 1,
            componentType: componentType.hawk,
        }
        createAssetPool(params);

        var stick = scene.getObjectByName("stick");
        var stickSize = 12;
        params = {
            count: stickSize,
            original: stick,
            scale: 1,
            componentType: componentType.stick,
        }
        createAssetPool(params);

    }


    function createAssetPool(params) {

        for (var i = 0; i < params.count; i++) {

            var asset = new THREE.Object3D();
            var egg = new THREE.Object3D();

            cloneAsset(params, asset, false);

            if (params.componentType === componentType.duckling) {
                cloneAsset(params, egg, true);
            }

            var instance;
            switch (params.componentType) {
                case componentType.duck:
                    instance = new playerControls(scene, asset);
                    break;
                case componentType.fox:
                    //asset.userData.speed = config.getSpeed(componentType.fox);
                    instance = new Predator(scene, asset, predatorType.fox);
                    break;
                case componentType.croq:
                    //asset.userData.speed = config.getSpeed(componentType.croq);
                    instance = new Predator(scene, asset, predatorType.croq);
                    break;
                case componentType.hawk:
                    //asset.userData.speed = config.getSpeed(componentType.hawk);
                    instance = new Predator(scene, asset, predatorType.hawk);
                    break;
                case componentType.duckling:
                    //asset.userData.speed = config.getSpeed(componentType.hawk);
                    instance = new ducklingAI(scene, asset, egg);
                    break;
                case componentType.stick:
                    //asset.userData.speed = config.getSpeed(componentType.hawk);
                    instance = asset;
                    break;
            }

            assetPools[params.componentType].push(instance);
        }

    }

    function cloneAsset(params, asset, egg) {

        var original;

        if (egg) {
            original = scene.getObjectByName("egg");
        }
        else {
            original = params.original;
        }

        original.traverse(function (child) {

            if (child instanceof THREE.Mesh) {
                var childClone = child.clone();
                asset.add(childClone);
            }

            if (!egg) {
                asset.scale.x = params.scale;
                asset.scale.y = params.scale;
                asset.scale.z = params.scale;
                asset.userData.componentType = params.componentType;
            }
            else {
                asset.userData.componentType = componentType.egg;
                //asset.userData.hatchTime = config.getHatchTime();
                asset.userData.hatchTime = 5;
            }

            asset.position.y = -100;
            scene.add(asset);

        });

    }


    function populateAssets() {

        //rest to zer
        var defaultLocation = new THREE.Vector2(20, 20);

        //var foxCount = config.getCount(componentType.fox);
        var foxCount = 2;

        //var hawkCount = config.getCount(componentType.hawk);
        var hawkCount = 1;

        //var croqCount = config.getCount(componentType.croq);
        var croqCount = 5;

        //var ducklingCount = config.getCount(componentType.duckling);
        var ducklingCount = 4;
        ducklingsSpawned = ducklingCount;

        //var stickCount = config.getCount(componentType.stick);
        var stickCount = 12;

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
        (new THREE.Vector2(7, 15)),
        (new THREE.Vector2(5, 12)),
        (new THREE.Vector2(3, 35)),
        (new THREE.Vector2(5, 25)),
        (new THREE.Vector2(15, 15)),
        (new THREE.Vector2(15, 25)),
        (new THREE.Vector2(35, 35)),
        (new THREE.Vector2(25, 15)),
        (new THREE.Vector2(25, 10))]

        var sticks = {
            count: stickCount,
            componentType: componentType.stick,
            locations: stickLocations,
            locationComponent: componentType.land,
            componentType: componentType.stick
        }

        spawnActor(duck);
        spawnActor(foxes);
        spawnActor(hawks);
        spawnActor(croqs);
        spawnActor(ducklings);
        spawnPawn(sticks);

    }

    function spawnActor(params) {

        for (var i = 0; i < params.count; i++) {

            actorsInLevel.push(assetPools[params.componentType][i]);

            var pos = actorsInLevel.length - 1;

            //TO DO: could also move the spawning back to here from AIs
            actorsInLevel[pos].getActor().userData.locationComponent = params.locationComponent;
            actorsInLevel[pos].getActor().userData.location = params.locations[i];

            actorsInLevel[pos].spawn();

        }
    }

    function spawnPawn(params) {

        for (var i = 0; i < params.count; i++) {

            var pawn = assetPools[params.componentType][i];
            pawnsInLevel.push(pawn);
            pawn.userData.locationComponent = params.locationComponent;
            pawn.userData.location = params.locations[i];

            grid.placeActor(pawn);

        }
    }

    function despawn() {
        setAIActiveState(false);
        var allActors = actorsInLevel.length;
        for (var i = 0; i < allActors; i++) {
            var type = actorsInLevel[i].getActor().userData.componentType;

            if (type === componentType.croq || type === componentType.hawk || type === componentType.fox) {
                actorsInLevel[i].despawn();
            }
        }
        actorsInLevel = [];

        var allPawns = pawnsInLevel.length;
        for (var i = 0; i < allPawns; i++) {
            pawnsInLevel[i].position.y = -100;
        }

        pawnsInLevel = [];
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

    function removeActor(actor) {
        var location = 0;
        var found = false;
        var length = actorsInLevel.length;
        for (var i = 0; i < length; i++) {
            if (actorsInLevel[i].getActor() == actor) {
                found = true;
                location = i;
                break;
            }
        }

        if (found) {
            for (i = location; i < length - 1; i++) {
                actorsInLevel[i] = actorsInLevel[i + 1];
            }

            actorsInLevel.length = length - 1;
            //console.log(actorsInLevel.length);
        }
        else {
            console.log("actor doesn't exist");
        }
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
                AIsActive = true
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