function levelAI(scene, clock, currentLevel, difficulty) {

    this.getState = getState;
    this.setState = setState;
    this.updateSettings;

    /*
    publish: level scores
    subscribe: userAction (nest)
    */
    var currentState;
    setState(levelState.init);

    //should come straight from playerControler?
    var score;
    var assets = [];
    var assetInstances = [];
    var originals = {};
    var player;
    var loader;

    var currentLevel = 1;
    var invisibilityLevel = 0;
    var speedLevel = 0;
    var quackLevel = 0;

    var envGenerator;
    var levelAssetsLoaded = false;

    setupSubscriptions();
    setupPublications();
    loadAssets();
    //rest takes place in update()

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


    function initAssetOriginals() {

        var duck = scene.getObjectByName("duck");
        duck.userData.componentType = componentType.duck;
        duck.position.y = -100;
        originals.duck = duck;

        var fox = scene.getObjectByName("fox");
        fox.userData.componentType = componentType.fox;
        fox.position.y = -100;
        originals.fox = fox;

        var croq = scene.getObjectByName("croq");
        croq.userData.componentType = componentType.croq;
        croq.position.y = -100;
        originals.croq = croq

        var egg = scene.getObjectByName("egg");
        //careful
        egg.userData.componentType = componentType.duckling;
        egg.position.y = -100;
        originals.egg = egg;

        var duckling = scene.getObjectByName("duckling");
        //duckling.userData.componentType = componentType.duckling;
        duckling.userData.callable = false;
        duckling.position.y = -100;
        originals.duckling = duckling;

        var hawk = scene.getObjectByName("hawk");
        //hawk.userData.componentType = componentType.hawk;
        hawk.position.y = -100;
        originals.hawk = hawk;

        var grass = scene.getObjectByName("grass");
        //grass.userData.componentType = componentType.grass;
        grass.position.y = -100;
        originals.grass = grass;

        var stick = scene.getObjectByName("stick");
        //stick.userData.componentType = componentType.stick;
        stick.position.y = -100;
        originals.stick = stick;
    }


    function populateAssets() {

        //rest to zero
        assets.length = 0;
        var defaultLocation = new THREE.Vector2(20, 20);

        var foxCount = 2;
        var hawkCount = 1;
        var croqCount = 5;
        var ducklingCount = 5;
        var stickCount = 4;
        var duckCount = 1;

        //TO DO: add rotation, not always down, will affect object mover
        var duckLocations = [(new THREE.Vector2(20, 20))]
        var duck = {
            count: duckCount,
            original: originals.duck,
            scale: 10,
            componentType: componentType.duck,
            locations: duckLocations,
            locationComponent: componentType.land
        }

        var foxLocations = [(new THREE.Vector2(25, 25)), (new THREE.Vector2(30, 30))]
        var foxes = {
            count: foxCount,
            original: originals.fox,
            scale: 10,
            componentType: componentType.fox,
            locations: foxLocations,
            locationComponent: componentType.land
        }

        var hawkLocations = [(new THREE.Vector2(27, 25))]
        var hawks = {
            count: hawkCount,
            original: originals.hawk,
            scale: 1,
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
            original: originals.croq,
            scale: 1,
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
            original: originals.egg,
            scale: 1,
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
            original: originals.stick,
            scale: 1,
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

        return assets;
    }

    function spawnAsset(params) {

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
                scene.add(obj.asset);

            });

            obj.location = params.locations[i];
            obj.locationComponent = params.locationComponent;
            obj.asset.userData.componentType = params.componentType;
            if (params.componentType === componentType.duckling) {
                obj.asset.userData.callable = false;
            }
            assets.push(obj.asset);

            placeAsset(obj);

            switch (params.componentType) {
                case componentType.duck:
                    assetInstances.push(new playerControls(scene, obj.asset));
                    break;
                case componentType.fox:
                    assetInstances.push(new foxAI(scene, obj.asset));
                    break;
                case componentType.croq:
                    assetInstances.push(new croqAI(scene, obj.asset));
                    break;
                case componentType.hawk:
                    assetInstances.push(new hawkAI(scene, obj.asset));
                    break;
                case componentType.duckling:
                    assetInstances.push(new ducklingAI(scene, obj.asset));
                    break;
            }
        }
    }

    //init prototypes, initLevelAssets
    function buildLevel() {

        //TO DO: load setup struct based on level from config.js
        //var levelSettings = config(currentLevel);
        //reset 
        var levelSettings = 0;
        envGenerator.buildEnv(levelSettings);
        grid.reset();
        //assetInstances, delete and set to 0
        //assets, remove from 3D scene and set to 0
        //better yet, create all clones at game start and hide outside of frustrum!!!
        //better still, make those addressable instances
        populateAssets();

        levelAssetsLoaded = true;

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

    function setAIActiveState(state) {
        for (var i = 0; i < assetInstances.length; i++) {
            assetInstances[i].setActive(state);
        }
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
                buildLevel();
            }
            else {
                levelAssetsLoaded = false;
                setState(levelState.ready)
            }
        }

        if (currentState === levelState.play) {

            for (var i = 0; i < assetInstances.length; i++) {
                assetInstances[i].update();
            }

            //set all duckling.userData.callable = false (need to setup a pool)
            if (duck)
                grid.updateDucklingsInRadius(duck);

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