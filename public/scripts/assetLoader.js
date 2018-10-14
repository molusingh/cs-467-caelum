function assetLoader(scene) {

    var duck = new THREE.Object3D();
    duck.name = "duck";

    var fox = new THREE.Object3D();
    duck.name = "fox";

    var allAssetsLoaded = false;

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
        allAssetsLoaded = true;
    }

    //load FPO env
    var loader = new THREE.FBXLoader(manager);
    loader.load('./geo/envFPO.fbx', function (object) {
        object.traverse(function (child) {

            if (child instanceof THREE.Mesh) {
                //child.scale.x = 10;
                child.castShadow = true;
                child.receiveShadow = true;
                child.shadowMaterial = shadowMat;
            }

        });
        object.scale.x = 100;
        object.scale.y = 100;
        object.scale.z = 100;
        object.castShadow = true;
        object.receiveShadow = true;
        scene.add(object);

    });

    //load Mama Duck
    var duckLoader = new THREE.FBXLoader(manager);
    duckLoader.load('./geo/duck.fbx', function (object) {
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

        duck.add(object);
        duck.userData = { currentDirection: "down" }
        console.log('Current direction is ' + duck.userData.currentDirection);
        scene.add(duck);

    }, undefined, function (e) {
        console.error(e);
    });

    //load Mama Duck
    var foxLoader = new THREE.FBXLoader(manager);
    foxLoader.load('./geo/fox.fbx', function (object) {
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

        fox.add(object);
        console.log('Current direction is ' + duck.userData.currentDirection);
        scene.add(fox);

    }, undefined, function (e) {
        console.error(e);
    });


    this.checkAssetsLoaded = function () {
        if (allAssetsLoaded === true) {
            return true;
        }
        else {
            return false;
        }
    }

}