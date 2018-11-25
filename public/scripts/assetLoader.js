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

    var eggShell = new THREE.Object3D();
    eggShell.name = "eggShell";

    var hawk = new THREE.Object3D();
    hawk.name = "hawk";

    var grass = new THREE.Object3D();
    grass.name = "grass";

    var stick = new THREE.Object3D();
    stick.name = "stick";

    var nest = new THREE.Object3D();
    nest.name = "nest";

    var croqGetsDuck = new THREE.Object3D();
    croqGetsDuck.name = "croqGetsDuck";

    var duckFly = new THREE.Object3D();
    duckFly.name = "duckFly";

    var blood = new THREE.Object3D();
    blood.name = "blood";

    var allAssetsLoaded = false;

    var shadowMat = new THREE.ShadowMaterial({
        color: 0xff0000, transparent: true, opacity: 0.5
    });


    var manager = new THREE.LoadingManager();
    //var anim;

    manager.onLoad = function () {
        // console.log("STATIC ASSETS LOADED");
        allAssetsLoaded = true;
        //anim = new animation(scene);
    }


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
        object.position.y = -100;

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
        object.position.y = -100;

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
        object.position.y = -100;

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
        object.position.y = -100;

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
        object.position.y = -100;

        egg.add(object);
        scene.add(egg);

    }, undefined, function (e) {
        console.error(e);
    });

    //load eggCracked 
    var eggLoader = new THREE.FBXLoader(manager);
    eggLoader.load('./geo/eggCracked.fbx', function (object) {
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
        object.position.y = -100;

        eggShell.add(object);
        scene.add(eggShell);

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
        object.position.y = -100;

        hawk.add(object);
        scene.add(hawk);

    }, undefined, function (e) {
        console.error(e);
    });

    //load grass 
    var grassLoader = new THREE.FBXLoader(manager);
    grassLoader.load('./geo/grass.fbx', function (object) {
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
        //object.position.y = -100;

        grass.add(object);
        scene.add(grass);

    }, undefined, function (e) {
        console.error(e);
    });

    //load stick 
    var stickLoader = new THREE.FBXLoader(manager);
    stickLoader.load('./geo/stick.fbx', function (object) {
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
        object.position.y = -100;

        stick.add(object);
        scene.add(stick);

    }, undefined, function (e) {
        console.error(e);
    });

    //load nest 
    var nestLoader = new THREE.FBXLoader(manager);
    nestLoader.load('./geo/nest.fbx', function (object) {
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
        object.position.y = -100;

        nest.add(object);
        scene.add(nest);

    }, undefined, function (e) {
        console.error(e);
    });

    var croqGetsDuckLoader = new THREE.FBXLoader(manager);
    croqGetsDuckLoader.load('./geo/croqGetsDuck.fbx', function (object) {
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

        croqGetsDuck.add(object);
        scene.add(croqGetsDuck);

    }, undefined, function (e) {
        console.error(e);
    });

    var duckflyLoader = new THREE.FBXLoader(manager);
    duckflyLoader.load('./geo/duckfly.fbx', function (object) {
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
        //object.visible = false;

        duckFly.add(object);
        scene.add(duckFly);

    }, undefined, function (e) {
        console.error(e);
    });

    var bloodLoader = new THREE.FBXLoader(manager);
    bloodLoader.load('./geo/blood.fbx', function (object) {
        object.traverse(function (child) {

            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.shadowMaterial = shadowMat;
            }

        });
        object.scale.x = 3;
        object.scale.y = 3;
        object.scale.z = 3;
        object.visible = false;

        blood.add(object);
        scene.add(blood);

    }, undefined, function (e) {
        console.error(e);
    });

}