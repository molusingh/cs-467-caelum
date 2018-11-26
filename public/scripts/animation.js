function animation(scene) {

    this.placeBlood = placeBlood;
    this.breakEgg = breakEgg;

    var pool = scene.getObjectByName("blood");
    var eggShell = scene.getObjectByName("eggShell");

    bus.subscribe("showBlood", placeBlood);

    function placeBlood(location) {
        var blood = new THREE.Object3D();
        clone(pool, blood);

        blood.position.x = location.x;
        blood.position.y = 0;
        blood.position.z = location.z;
        blood.scale.x = 3;
        blood.scale.y = 3;
        blood.scale.z = 3;

        setTimeout(function () { scene.remove(blood); }, 1000);
    }

    function breakEgg(location) {

        var yolk = new THREE.Object3D();
        var shell = new THREE.Object3D();

        clone(pool, yolk);
        var mat = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.SingleSide });
        clone(eggShell, shell);

        yolk.position.x = location.x;
        yolk.position.y = 0;
        yolk.position.z = location.z;
        yolk.traverse(function (child) {

            if (child instanceof THREE.Mesh) {
                child.material = mat;
            }

        });
        yolk.material = mat;

        shell.position.x = location.x;
        shell.position.y = 0;
        shell.position.z = location.z;

        yolk.scale.x = 2;
        yolk.scale.y = 2;
        yolk.scale.z = 2;

        setTimeout(function () {
            scene.remove(yolk);
            scene.remove(shell);
        }, 1000);

    }

    function clone(original, asset) {

        original.traverse(function (child) {

            if (child instanceof THREE.Mesh) {
                var childClone = child.clone();
                asset.add(childClone);
            }
            scene.add(asset);
        });
    }

}