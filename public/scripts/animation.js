function animation(scene) {

    this.placeBlood = placeBlood;

    var poolOfBlood = scene.getObjectByName("blood");
    bus.subscribe("showBlood", placeBlood);

    function placeBlood(location) {
        var blood = new THREE.Object3D();
        clone(poolOfBlood, blood);

        blood.position.x = location.x;
        blood.position.y = 0;
        blood.position.z = location.z;
        blood.scale.x = 3;
        blood.scale.y = 3;
        blood.scale.z = 3;

        setTimeout(function () { scene.remove(blood); }, 1000);
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