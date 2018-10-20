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