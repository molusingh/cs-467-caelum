function levelAI(scene, clock, currentLevel, difficulty) {

    var currentState, score;
    var userInterface;
    var assetArray;
    var player;

    var duck = new THREE.Object3D();
    duck.name = "duck";

    determineAssets();
    loadAssets();
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

        /*
        var geometry2 = new THREE.BoxBufferGeometry(6, 8, 6);

        var diffuseColor2 = new THREE.Color().setHSL(0.9, 0.5, 1 * 0.5 + 0.1);
        var material2 = new THREE.MeshLambertMaterial({
            color: diffuseColor2,
        });

        duck = new THREE.Mesh(geometry2, material2, shadowMat);
        duck.castShadow = true;
        duck.receiveShadow = true;
        duck.position.x = -20;
        duck.position.z = -10;
        duck.position.y = 0;
        scene.add(duck);
        */

        var manager = new THREE.LoadingManager();

        manager.onLoad = function () {
            console.log("finished loading: " + duck);
            console.log(duck.name);
            initAssets();
        }

        var loader = new THREE.FBXLoader(manager);
        loader.load('./geo/duck.fbx', function (object) {
            object.traverse(function (child) {

                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.shadowMaterial = shadowMat;
                }

            });
            object.scale.x = 10;
            object.scale.y = 10;
            object.scale.z = 10;
            object.position.x = -20;

            duck.add(object);
            scene.add(duck);
        }, undefined, function (e) {
            console.error(e);
        });

    }

    function initAssets() {

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