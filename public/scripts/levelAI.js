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

        //need to set up referencing
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


    function placeAsset(asset, component, location) {
        grid.placeAsset(asset, component, location);

        var cube = new THREE.CubeGeometry(1, 1, 1);
        cube.applyMatrix(new THREE.Matrix4().makeTranslation(0.5, 0.5, -0.5));
        var material = new THREE.MeshLambertMaterial({ color: 0xff0000, wireframe: false });

        //is space under future obstacle all land
        var isLegal = false;
        //add cut off for 100 attempts
        var attempts = 0;

        while (isLegal === false) {

            attempts++;
            var location = new THREE.Vector2(randomLocationX, randomLocationY);
            isLegal = checkForLegalLocation(size, location);

            console.log("attempts: " + attempts);
            randomLocationX = getRandomInt(40 - randomSizeX);
            randomLocationY = getRandomInt(40 - randomSizeY);

            var location = new THREE.Vector2(randomLocationX, randomLocationY);


            if (attempts > 100) {
                console.log("attempts: DONE");
                continue;
            }
        }

        var y = originY + (randomLocationY * 10) - 10;
        var x = originX - (randomLocationX * 10) + 10;

        obstacle.position.z = x;
        obstacle.position.x = y;

        registerInGrid(size, location, componentType.obstacle);
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