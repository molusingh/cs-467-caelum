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
        loader = new assetLoader(scene);
        //load env here
    }

    function initAssets() {
        //need to set up referencing
        var duck = scene.getObjectByName("duck");
        player = new playerControls(scene, clock, duck);

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