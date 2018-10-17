function assetLoader(scene) {

    var duck = new THREE.Object3D();
    duck.name = "duck";

    var fox = new THREE.Object3D();
    fox.name = "fox";

    var croq = new THREE.Object3D();
    croq.name = "croq";

    var duckling = new THREE.Object3D();
    duckling.name = "duckling";

    var egg = new THREE.Object3D();
    egg.name = "egg";

    var hawk = new THREE.Object3D();
    hawk.name = "hawk";

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
        scene.add(duck);

    }, undefined, function (e) {
        console.error(e);
    });

    //load Fox 
    var foxLoader = new THREE.FBXLoader(manager);
    foxLoader.load('./geo/fox.fbx', function (object) {
        object.traverse(function (child) {

            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.shadowMaterial = shadowMat;
            }

        });
        object.scale.x = 12;
        object.scale.y = 12;
        object.scale.z = 12;

        fox.add(object);
        scene.add(fox);

    }, undefined, function (e) {
        console.error(e);
    });

    //load Croq 
    var croqLoader = new THREE.FBXLoader(manager);
    croqLoader.load('./geo/croq.fbx', function (object) {
        object.traverse(function (child) {

            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.shadowMaterial = shadowMat;
            }

        });
        object.scale.x = 1;
        object.scale.y = 1;
        object.scale.z = 1;

        croq.add(object);
        scene.add(croq);

    }, undefined, function (e) {
        console.error(e);
    });

    //load duckling 
    var ducklingLoader = new THREE.FBXLoader(manager);
    ducklingLoader.load('./geo/duckling.fbx', function (object) {
        object.traverse(function (child) {

            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.shadowMaterial = shadowMat;
            }

        });
        object.scale.x = 1;
        object.scale.y = 1;
        object.scale.z = 1;

        duckling.add(object);
        scene.add(duckling);

    }, undefined, function (e) {
        console.error(e);
    });

    //load egg 
    var eggLoader = new THREE.FBXLoader(manager);
    eggLoader.load('./geo/eggUncracked.fbx', function (object) {
        object.traverse(function (child) {

            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.shadowMaterial = shadowMat;
            }

        });
        object.scale.x = 1;
        object.scale.y = 1;
        object.scale.z = 1;

        egg.add(object);
        scene.add(egg);

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

    //load egg 
    var hawkLoader = new THREE.FBXLoader(manager);
    hawkLoader.load('./geo/hawk.fbx', function (object) {
        object.traverse(function (child) {

            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.shadowMaterial = shadowMat;
            }

        });
        object.scale.x = 1;
        object.scale.y = 1;
        object.scale.z = 1;

        hawk.add(object);
        scene.add(hawk);

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