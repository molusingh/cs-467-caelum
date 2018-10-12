function levelAI(scene, clock, currentLevel, difficulty) {

    var currentState, score;
    var levelAI, userInterface;
    var assetArray;
    var player, duck;

    determineAssets();
    loadAssets();
    initAssets();
    setupSubscriptions();
    //only if above successful 
    setState(levelState.ready);

    function setupSubscriptions() {
    }

    function determineAssets() {
    }

    function loadAssets() {

        var shadowMat = new THREE.ShadowMaterial({
            color: 0xff0000, transparent: true, opacity: 0.5
        });

        var geometry2 = new THREE.BoxBufferGeometry(6, 8, 6);

        var diffuseColor2 = new THREE.Color().setHSL(0.9, 0.5, 1 * 0.5 + 0.1);
        var material2 = new THREE.MeshLambertMaterial({
            color: diffuseColor2,
        });

        duck = new THREE.Mesh(geometry2, material2, shadowMat);
        duck.castShadow = true;
        duck.receiveShadow = true;
        duck.position.x = -20;
        duck.position.y = 0;
        scene.add(duck);

    }

    function initAssets() {
        //need to set up referencing
        player = new playerControls(scene, clock, duck);

    }

    function setState(state) {
        currentState = state;
    }

    function endLevel() {
    }

    this.update = function () {

        var elapsedTime = clock.getElapsedTime();

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