function levelAI(scene) {

    this.getState = getState;
    this.setState = setState;
    this.updateSettings = updateSettings;

    var currentState;
    setState(levelState.init);

    var actorsInLevel = [];
    var pawnsInLevel = [];
    //num of enums
    var assetPools = init2DArray(16);
    var loader;
    var ducklingsSpawned = 0;
    var ducklingsDead = 0;
    var ducklingsNested = 0;

    var currentLevel = 1;
    var AIsActive = false;

    var envGenerator;
    var levelAssetsLoaded = false;

    setupSubscriptions();
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
        bus.subscribe("ducklingDead", addDead);
        bus.subscribe("ducklingNested", addNested);
        bus.subscribe("foundStick", foundStick);
        bus.subscribe("ducklingHatched", breakShell);
    }

    function breakShell(duckling) {

        var location = duckling.position;
        placePawn(componentType.eggShell, location);

    }

    function addNested() {
        ducklingsNested++;
        bus.publish("updateScore");
        checkDucklings();
    }

    function updateDucklingStatusLabels() {

        var roaming = ducklingsSpawned - ducklingsNested - ducklingsDead;
        var args = { roaming: roaming, nested: ducklingsNested, dead: ducklingsDead };
        bus.publish("updateDucklingLabels", args);

    }

    function addDead(actor) {
        removeActor(actor);
        ducklingsDead++;
        checkDucklings();
    }

    function checkDucklings() {

        if (ducklingsDead + ducklingsNested == ducklingsSpawned) {
            setTimeout(callback, 250); // delay to end level
            function callback() {
                if (ducklingsNested === 0) {
                    currentState = levelState.loss;
                }
                else {
                    currentState = levelState.end;
                }
                cleanup();
            }

        }
    }

    function foundStick(stick) {
        stick.position.y = -100;
        grid.removeActor(stick);
    }

    function loadAssets() {
        loader = new assetLoader(scene);
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
        var foxSize = config.getPoolSize(componentType.fox);
        params = {
            count: foxSize,
            original: fox,
            scale: 12,
            componentType: componentType.fox,
        }
        createAssetPool(params);

        var croq = scene.getObjectByName("croq");
        var croqSize = config.getPoolSize(componentType.croq);
        params = {
            count: croqSize,
            original: croq,
            scale: 1,
            componentType: componentType.croq,
        }
        createAssetPool(params);

        var duckling = scene.getObjectByName("duckling");
        var egg = scene.getObjectByName("egg");
        var ducklingSize = config.getPoolSize(componentType.duckling);
        params = {
            count: ducklingSize,
            original: duckling,
            scale: 1,
            componentType: componentType.duckling,
            egg: egg
        }
        createAssetPool(params);

        var hawk = scene.getObjectByName("hawk");
        var hawkSize = config.getPoolSize(componentType.hawk);
        params = {
            count: hawkSize,
            original: hawk,
            scale: 1,
            componentType: componentType.hawk,
        }
        createAssetPool(params);

        var stick = scene.getObjectByName("stick");
        var stickSize = config.getPoolSize(componentType.stick);
        params = {
            count: stickSize,
            original: stick,
            scale: 1,
            componentType: componentType.stick,
        }
        createAssetPool(params);

        var eggShell = scene.getObjectByName("eggShell");
        var eggShellSize = config.getPoolSize(componentType.duckling);
        params = {
            count: eggShellSize,
            original: eggShell,
            scale: 1,
            componentType: componentType.eggShell,
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
                    var flyingDuck = scene.getObjectByName("duckFly");
                    instance = new playerControls(scene, asset, flyingDuck);
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
                    //asset.userData.speed = config.getSpeed(componentType.duckling);
                    instance = new ducklingAI(scene, asset, egg);
                    break;
                case componentType.stick:
                    instance = asset;
                    break;
                case componentType.eggShell:
                    asset.userData.available = true;
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
                asset.userData.hatchTime = config.getHatchTime();
                //asset.userData.hatchTime = 5;
            }

            asset.position.y = -100;
            scene.add(asset);

        });

    }


    function populateAssets() {

        var foxCount = config.getCount(componentType.fox);

        var hawkCount = config.getCount(componentType.hawk);

        var croqCount = config.getCount(componentType.croq);

        var ducklingCount = config.getCount(componentType.duckling);
        ducklingsSpawned = ducklingCount;

        var stickCount = config.getCount(componentType.stick);

        var duckCount = 1;

        //TO DO: add rotation, not always down, will affect object mover
        var duckLocations = [(new THREE.Vector2(20, 20))]
        var duck = {
            count: duckCount,
            locations: duckLocations,
            locationComponent: componentType.land,
            componentType: componentType.duck
        }

        var foxLocations = config.generateLocations(foxCount);
        var foxes = {
            count: foxCount,
            componentType: componentType.fox,
            locations: foxLocations,
            locationComponent: componentType.land,
        }

        var hawkLocations = config.generateLocations(hawkCount);
        var hawks = {
            count: hawkCount,
            locations: hawkLocations,
            //TO DO: air i.e. special case
            locationComponent: componentType.air,
            componentType: componentType.hawk
        }

        var croqLocations = config.generateLocations(croqCount);

        var croqs = {
            count: croqCount,
            locations: croqLocations,
            locationComponent: componentType.water,
            componentType: componentType.croq
        }

        var ducklingLocations = config.generateLocations(ducklingCount);

        var ducklings = {
            count: ducklingCount,
            locations: ducklingLocations,
            locationComponent: componentType.land,
            componentType: componentType.duckling
        }

        var stickLocations = config.generateLocations(stickCount);

        var sticks = {
            count: stickCount,
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

            actorsInLevel[pos].getActor().userData.locationComponent = params.locationComponent;
            actorsInLevel[pos].getActor().userData.location = params.locations[i];

            actorsInLevel[pos].spawn();

        }
    }

    //series of pawns, at level load
    function spawnPawn(params) {

        for (var i = 0; i < params.count; i++) {

            var pawn = assetPools[params.componentType][i];
            pawnsInLevel.push(pawn);
            pawn.userData.locationComponent = params.locationComponent;
            pawn.userData.location = params.locations[i];

            grid.placeActor(pawn);

        }
    }

    //specific pawn, during game play
    function placePawn(type, location) {

        var pawn;

        for (var i = 0; i < assetPools[type].length; i++) {
            var candidate = assetPools[type][i];
            if (candidate.userData.available) {
                pawn = candidate;
                break;
            }
        }

        if (pawn !== undefined) {
            pawn.position.x = location.x;
            pawn.position.y = location.y;
            pawn.position.z = location.z;
            pawn.userData.available = false;
            pawnsInLevel.push(pawn);
        }
        else {
            console.log("No pawn available");
        }

    }

    function despawn() {
        setAIActiveState(false);
        var allActors = actorsInLevel.length;
        for (var i = 0; i < allActors; i++) {
            var type = actorsInLevel[i].getActor().userData.componentType;

            if (type === componentType.croq ||
                type === componentType.hawk ||
                type === componentType.fox ||
                type === componentType.duckling) {
                actorsInLevel[i].despawn();
            }
        }
        actorsInLevel = [];

        var allPawns = pawnsInLevel.length;
        for (var i = 0; i < allPawns; i++) {
            pawnsInLevel[i].position.y = -100;
            var type = pawnsInLevel[i].userData.componentType;
            if (type === componentType.eggShell ||
                type === componentType.stick) {
                pawnsInLevel[i].userData.available = true;
            }
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
        actorsInLevel[0].cleanup();
        despawn();
        grid.reset();
        //object gets deleted, but scene elements remain otherwise
        envGenerator.cleanup();
        AIsActive = false;
        playerAI.reset();

        ducklingsSpawned = 0;
        ducklingsDead = 0;
        ducklingsNested = 0;
        bus.publish("levelChange");
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
        }
        else {
            //console.log("actor doesn't exist");
        }
    }

    var playerAI = {};

    this.update = function () {

        var elapsedTime = clock.getElapsedTime();
        updateDucklingStatusLabels();

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