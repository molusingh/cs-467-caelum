
var config = new setup();

function setup() {

    this.getCount = getCount;
    this.getLandColor = getLandColor;
    this.getWaterColor = getWaterColor;

    var currentLevel = 1;
    var minHatchTime;
    var maxHatchTime;

    //hex: 996633 converted to decimal * 100
    var landColor = new THREE.Vector3(60, 40, 20);
    console.log("red: " + this.getLandColor().red);
    console.log("green: " + this.getLandColor().green);
    console.log("blue: " + this.getLandColor().blue);

    var min = [];
    for (var i = 0; i < componentType.length; i++) {
        min[i].push(0);
    }

    var max = [];
    for (var i = 0; i < componentType.length; i++) {
        max[i].push(0);
    }

    bus.subscribe("levelChange", updateLevel);
    bus.publish("playerLoses", resetLevels);

    function resetLevels() {
        currentLevel = 1;
    }

    function updateLevel() {
        currentLevel++;
    }

    function getRandomInRange(min, max) {
        var offset = getRandomInt(max - min);
        return min + offset;
    }

    function getCount(componentType) {
        return getRandomInRange(min[componentType], max[componentType]);
    }

    function getLandColor() {
        var red = getRandomInRange(landColor.x - 10, landColor.x + 10) / 100;
        var green = getRandomInRange(landColor.y - 8, landColor.y + 8) / 100;
        var blue = getRandomInRange(landColor.z - 5, landColor.z + 5) / 100;
        return new THREE.Color(red, green, blue);
    }

    function getWaterColor() {
        var green = getRandomInRange(20, 28) / 100;
        return new THREE.Color(0, green, 1);
    }

    //LEVEL 1

    min[componentType.duckling] = 3;
    max[componentType.duckling] = 4;

    min[componentType.hawk] = 0;
    max[componentType.hawk] = 0;

    min[componentType.fox] = 2;
    max[componentType.fox] = 3;

    min[componentType.croq] = 3;
    max[componentType.croq] = 5;

    min[componentType.grass] = 4;
    max[componentType.grass] = 4;

    min[componentType.obstacle] = 4;
    max[componentType.obstacle] = 4;

    min[componentType.stick] = 12;
    max[componentType.stick] = 12;

    minHatchTime = 5;
    maxHatchTime = 15;
}