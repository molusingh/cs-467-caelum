function animation(scene) {

    var poolOfBlood = scene.getObjectByName("blood");
    bus.subscribe("showBlood", showBlood);

    function showBlood(location) {
        var blood = new THREE.Object3D();
        clone(poolOfBlood, blood);

        blood.position.x = location.x;
        blood.position.y = location.y;
        blood.position.z = location.z;

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